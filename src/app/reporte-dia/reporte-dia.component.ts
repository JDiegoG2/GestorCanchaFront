import { Component, OnInit } from '@angular/core';
import { ReservaResponse } from '../models/reserva-response.model';
import { SedeService } from '../services/sede.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Sede } from '../models/sede.model';
import { ReservaService } from '../services/reserva.service';
import { CanchaResponse } from '../models/cancha-response.model';
import { ReporteService } from '../services/reporte.service';

@Component({
  selector: 'app-reporte-dia',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reporte-dia.component.html',
  styleUrl: './reporte-dia.component.css'
})
export class ReporteDiaComponent implements OnInit {
  title = 'Reporte de reserva';
  reservas: ReservaResponse[] = [];
  sedes: Sede[] = [];
  canchas: CanchaResponse[] = [];
  canchaId: Number = 0;
  fecha: String = '';
  reporteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private reservaService: ReservaService,
    private reporteService: ReporteService,
    private sedeService: SedeService
  ) {
    this.reporteForm = this.fb.group({
      sede_id: [0],
      cancha_id: [0],
      fecha_reserva: ['']
    });
  }

  ngOnInit(): void {
    this.loadSedes();
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
    if (sedeId) {
      this.reservaService.listarCanchas(sedeId).subscribe((canchas) => {
        this.canchas = canchas;
      });
    }
  }

  onCanchaChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.canchaId = Number(target.value);
  }

  onFechaChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.fecha = target.value;
  }

  onSubmit(): void {
    console.log('canchaId', this.canchaId);
    console.log('fecha', this.fecha);
    this.reporteService.reporteCanchaDia(this.canchaId, this.fecha).subscribe((result) => {
      console.log(result);
      this.reservas = result;
    })
  }

}
