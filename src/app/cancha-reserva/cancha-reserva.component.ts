import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CanchaService } from '../services/cancha.service';
import { Cancha } from '../models/cancha.model';
import { SedeComponent } from '../sede/sede.component';
import { SedeService } from '../services/sede.service';
import { Sede } from '../models/sede';
import { TipoCanchaService } from '../services/tipo-cancha.service';

@Component({
  selector: 'app-cancha-reserva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,SedeComponent],
  templateUrl: './cancha-reserva.component.html',
  styleUrls: ['./cancha-reserva.component.css']
})
export class CanchaReservaComponent implements OnInit {
  title = 'Listado de Canchas disponibles';
  canchaForm: FormGroup;
  canchaAPI: Cancha[] = [];
  sedes: Sede[] = [];
  tiposCancha: string[] = [];


  constructor(
    private fb: FormBuilder,
    private canchaService: CanchaService,
    private router: Router,
    private toastr: ToastrService,
    private sedeService: SedeService,
    private tipoCanchaService: TipoCanchaService
  ) {
    this.canchaForm = this.fb.group({
      id: [0],
      tipo_cancha: ['', Validators.required],
      numero: ['', Validators.required],
      precio: [0, Validators.required],
      sede_id: [0, Validators.required],
      dis_hr_inicio: [0, Validators.required],
      dis_hr_fin: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCanchas();
    this.loadSedes();
    this.loadTiposCancha();


  }

  private loadSedes(): void {
    this.sedeService.listarSedes().subscribe(
      (data: any[]) => {
        console.log('Sedes cargadas:', data); // Log para depurar
        this.sedes = data;
      },
      (error) => {
        console.error('Error al cargar las sedes:', error);
      }
    );
  }

  private loadTiposCancha(): void {
    this.tipoCanchaService.getTiposCancha().subscribe(
      (data: string[]) => {
        console.log('Tipos de Cancha cargados:', data); // Log para depurar
        this.tiposCancha = data;
      },
      (error) => {
        console.error('Error al cargar los tipos de cancha:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.canchaForm.valid) {
      const newCancha = this.canchaForm.value as Cancha;

      this.canchaService.guardarCancha(newCancha).subscribe({
        next: (resp) => {
          this.canchaAPI.push(resp);
          this.toastr.success('Cancha agregada correctamente.');
          this.canchaForm.reset();
        },
        error: (err) => {
          console.error('Error al crear la cancha: ', err);
          this.toastr.error('Error al crear la cancha');
        }
      });
    } else {
      this.toastr.warning('Por favor, complete todos los campos requeridos.');
    }
  }

  loadCanchas(): void {
    this.canchaService.listarCanchas().subscribe({
      next: (data) => {
        this.canchaAPI = data;
        console.log('Lista de canchas actualizada.');
      },
      error: (err) => {
        console.error('Error al cargar canchas: ', err);
        this.toastr.error('Error al cargar canchas');
      }
    });
  }

  trackById(index: number, item: Cancha): any {
    return item.id;
  }

  submitDelete(canchaId: number): void {
    this.canchaService.eliminarCancha(canchaId).subscribe({
      next: () => {
        this.toastr.success('Cancha eliminada correctamente.');
        this.loadCanchas();
      },
      error: (err) => {
        console.error('Error al eliminar la cancha: ', err);
        this.toastr.error('Error al eliminar la cancha');
      }
    });
  }
}
