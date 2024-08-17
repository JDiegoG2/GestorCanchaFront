import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CanchaService } from '../services/cancha.service';
import { Cancha } from '../models/cancha.model';
import { SedeService } from '../services/sede.service';
import { Sede } from '../models/sede.model';
import { TipoCanchaService } from '../services/tipo-cancha.service';

@Component({
  selector: 'app-cancha-reserva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cancha-reserva.component.html',
  styleUrls: ['./cancha-reserva.component.css']
})
export class CanchaReservaComponent implements OnInit {
  title = 'Listado de Canchas disponibles';
  canchaForm: FormGroup;
  canchaAPI: Cancha[] = [];
  sedes: Sede[] = [];
  sedesActivas: Sede[] = [];
  tiposCancha: string[] = [];
  editing: boolean = false; // Flag para determinar si estamos editando

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
      numero: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(0)]], // Solo números positivos
      precio: [0, [Validators.required, Validators.min(0)]], // Precio no negativo
      sede_id: [0, Validators.required],
      dis_hr_inicio: [0, [Validators.required, Validators.min(0), Validators.max(23)]], // Horas de 0 a 23
      dis_hr_fin: [0, [Validators.required, Validators.min(0), Validators.max(23)]]
    });
  }

  ngOnInit(): void {
    this.loadCanchas();
    this.loadSedes();
    this.loadTiposCancha();
    this.cargarSedesActivas();
  }

  private loadSedes(): void {
    this.sedeService.listarSedes().subscribe(
      (data: Sede[]) => {
        console.log('Sedes cargadas:', data); // Log para depurar
        this.sedes = data;
      },
      (error) => {
        console.error('Error al cargar las sedes:', error);
      }
    );
  }

  cargarSedesActivas(): void {
    this.sedeService.listarSedesActivas().subscribe({
      next: (data) => {
        this.sedesActivas = data;
      },
      error: (err) => {
        console.error('Error al cargar sedes activas: ', err);
      }
    });
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

  toggleEstado(cancha: Cancha) {
    const nuevoEstado = !cancha.estado; // Cambia el estado al opuesto
    this.canchaService.actualizarEstado(cancha.id, nuevoEstado).subscribe(
      response => {
        console.log('Estado actualizado', response);
        cancha.estado = nuevoEstado; // Actualiza el objeto en la lista
      },
      error => {
        console.error('Error al actualizar el estado', error);
      }
    );
  }

  editCancha(cancha: Cancha): void {
    this.editing = true;
    this.canchaForm.setValue({
      id: cancha.id,
      tipo_cancha: cancha.tipo_cancha,
      numero: cancha.numero,
      precio: cancha.precio,
      sede_id: cancha.sede_id, // Asegúrate de usar el ID correcto
      dis_hr_inicio: cancha.dis_hr_inicio,
      dis_hr_fin: cancha.dis_hr_fin
      // No incluyas `estado` si no es necesario en el formulario
    });
  }

  onSubmit(): void {
    if (this.canchaForm.valid) {
      const formValue = this.canchaForm.value as Cancha;

      if (this.editing) {
        this.canchaService.actualizarCancha(formValue.id, formValue).subscribe({
          next: (resp) => {
            this.loadCanchas(); // Recargar la lista de canchas
            this.toastr.success('Cancha actualizada correctamente.');
            this.canchaForm.reset();
            this.editing = false;
          },
          error: (err) => {
            console.error('Error al actualizar la cancha: ', err);
            this.toastr.error('Error al actualizar la cancha');
          }
        });
      } else {
        const formValue = this.canchaForm.value as Cancha;
        this.canchaService.guardarCancha(formValue).subscribe({
          next: (resp) => {
            this.canchaAPI.push(resp);
            this.toastr.success('Cancha agregada correctamente.');
            this.canchaForm.reset();
          },
          error: (err) => {
            console.error('Error al crear la cancha: ', err);
            if (err !== undefined) {
              this.toastr.error(err.error.mensaje);
            } else {
              this.toastr.error('Error al crear la cancha');
            }
          }
        });
      }
    } else {
      this.toastr.warning('Por favor, complete todos los campos requeridos.');
    }
  }

  loadCanchas(): void {
    this.canchaService.listarCanchas().subscribe({
      next: (data) => {
        // Log para verificar los datos recibidos
        console.log('Datos recibidos:', data);

        // Verifica el estado de cada cancha
        data.forEach(cancha => {
          console.log(`Cancha ID: ${cancha.id}, Estado: ${cancha.estado}`);
        });

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

  getSedeNombre(sedeId: number): string {
    const sede = this.sedes.find(s => s.id === sedeId);
    return sede ? sede.nombre : 'Sede no encontrada';
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