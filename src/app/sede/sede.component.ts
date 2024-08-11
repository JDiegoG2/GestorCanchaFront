import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SedeService } from '../services/sede.service';
import { Sede } from '../models/sede.model';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-sede',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sede.component.html',
  styleUrl: './sede.component.css'
})
export class SedeComponent implements OnInit {
  title = 'Listado de Sedes';
  sedeForm: FormGroup;
  sedeAPI: Sede[] = [];

  constructor(
    private fb: FormBuilder,
    private sedeService: SedeService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.sedeForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      estado: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSedes();
  }

  private loadSedes(): void {
    this.sedeService.listarSedes().subscribe({
      next: (data) => {
        this.sedeAPI = data;
        console.log('Lista de sedes actualizada.');
      },
      error: (err) => {
        console.error('Error al cargar sedes: ', err);
        this.toastr.error('Error al cargar sedes');
      }
    });
  }

  onSubmit(): void {
    if (this.sedeForm.valid) {
      const newSede = this.sedeForm.value as Sede;
      newSede.estado = true;

      this.sedeService.crearSede(newSede).subscribe({
        next: (resp) => {
          this.sedeAPI.push(resp);
          this.toastr.success('Sede agregada correctamente.');
          this.sedeForm.reset();
        },
        error: (err) => {
          console.error('Error al crear la sede: ', err);
          this.toastr.error('Error al crear la sede');
        }
      });
    } else {
      this.toastr.warning('Por favor, complete todos los campos requeridos.');
    }
  }

  submitDelete(sedeId: number): void {
    this.sedeService.eliminarSede(sedeId).subscribe({
      next: () => {
        this.toastr.success('Sede eliminada correctamente.');
        this.loadSedes();
      },
      error: (err) => {
        console.error('Error al eliminar la sede: ', err);
        this.toastr.error('Error al eliminar la sede');
      }
    });
  }

  trackById(index: number, item: Sede): any {
    return item.id;
  }
}
