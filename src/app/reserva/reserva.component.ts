import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservaService } from '../services/reserva.service';
import { SedeService } from '../services/sede.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent implements OnInit  {


  reservaForm: FormGroup;
  sedes: any[] = [];
  canchas: any[] = [];
  horariosDisponibles: number[] = [];

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private toastr: ToastrService,
    private sedeService: SedeService
  ) {
    this.reservaForm = this.fb.group({
      sede_id: ['', Validators.required],
      cancha_id: ['', Validators.required],
      fechaReserva: ['', Validators.required],
      horaReserva: ['', Validators.required],
      observacion: [''],
      importe: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadSedes();
  }

  loadSedes(): void {
    this.sedeService.listarSedesActivas().subscribe(sedes => this.sedes = sedes);
  }

  onSedeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const sedeId = Number(target.value);
    this.reservaForm.get('cancha_id')?.reset();
    this.horariosDisponibles = [];
    if (sedeId) {
      this.reservaService.listarCanchas(sedeId).subscribe((canchas) => {
        this.canchas = canchas;
      });
    }
  }

  onCanchaChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const canchaId = Number(target.value);
    const fecha = this.reservaForm.get('fechaReserva')?.value;
    if (canchaId && fecha) {
      this.loadHorarios(canchaId, fecha);
    }
  }

  onFechaChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fecha = target.value;
    const canchaId = this.reservaForm.get('cancha_id')?.value;
    if (canchaId && fecha) {
      this.loadHorarios(canchaId, fecha);
    }
  }

  loadHorarios(canchaId: number, fecha: string): void {
    this.reservaService.listarHorarios(canchaId, fecha).subscribe((horarios) => {
      this.horariosDisponibles = horarios;
    });
  }

  onSubmit(): void {
    if (!this.reservaForm.valid) {
        this.toastr.warning('Por favor, complete todos los campos.');
        return;
    }

    const formValue = this.reservaForm.value;

    // Formatear la fecha en formato YYYY-MM-DD si no está en ese formato
    const fechaReserva = new Date(formValue.fechaReserva).toISOString().split('T')[0];

    const reservaData = {
        ...formValue,
        fecha_reserva: fechaReserva,
        hora_reserva: formValue.horaReserva,
        cancha_id: formValue.cancha_id,
        observacion: formValue.observacion || '',
        importe: formValue.importe,
        cliente_id: 1
    };

    this.reservaService.crearReserva(reservaData).subscribe(
        (response) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
            this.toastr.success('Reserva creada con éxito');
            this.reservaForm.reset();
            this.loadHorarios(reservaData.cancha_id, reservaData.fecha_reserva);
        },
        (error) => {
            this.toastr.error('Error al crear la reserva');
            console.error('Error al crear la reserva:', error);
        }
    );
}



  }
