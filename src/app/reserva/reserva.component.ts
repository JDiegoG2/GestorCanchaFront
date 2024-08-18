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
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  reservaForm: FormGroup;
  sedes: any[] = [];
  canchas: any[] = [];
  horariosDisponibles: number[] = [];
  reservaPreview: any = {}; // Inicializado como objeto vacío

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private toastr: ToastrService,
    private sedeService: SedeService
  ) {
    this.reservaForm = this.fb.group({
      sede_id: ['', Validators.required],
      cancha_id: ['', Validators.required],
      fechaReserva: ['', [Validators.required, this.validateDateFormat]],
      horaReserva: ['', Validators.required],
      observacion: [''],
      importe: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

  ngOnInit(): void {
    this.loadSedes();
  }

  validateDateFormat(control: any) {
    const DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/;
    return DATE_REGEXP.test(control.value) ? null : { invalidDate: true };
  }

  loadSedes(): void {
    this.sedeService.listarSedesActivas().subscribe(
      (sedes) => {
        console.log('Sedes cargadas:', sedes); // Verifica los datos recibidos
        this.sedes = sedes;
      },
      (error) => {
        console.error('Error al cargar las sedes:', error);
        this.toastr.error('Error al cargar las sedes');
      }
    );
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

  showPreview(): void {
    if (!this.reservaForm.valid) {
      this.toastr.warning('Por favor, complete todos los campos correctamente.');
      return;
    }

    const formValue = this.reservaForm.value;

    this.reservaPreview = {
      ...formValue,
      sedeNombre: this.sedes.find(sede => sede.id === formValue.sede_id)?.nombre,
      canchaNumero: this.canchas.find(cancha => cancha.id === formValue.cancha_id)?.numero
    };

    const modalElement = document.getElementById('previewModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      modalElement.setAttribute('aria-modal', 'true');
      modalElement.removeAttribute('aria-hidden');
      document.body.classList.add('modal-open');
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('previewModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.removeAttribute('aria-modal');
      document.body.classList.remove('modal-open');
    }
  }

  confirmReserva(): void {
    this.onSubmit();
  }

  onSubmit(): void {
    if (!this.reservaForm.valid) {
      this.toastr.warning('Por favor, complete todos los campos correctamente.');
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