import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReservaResponse } from '../models/reserva-response.model';
import { ToastrService } from 'ngx-toastr';
import { ReporteService } from '../services/reporte.service';

@Component({
  selector: 'app-reporte-rango',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reporte-rango.component.html',
  styleUrl: './reporte-rango.component.css'
})
export class ReporteRangoComponent implements OnInit {
  title = 'Reporte de Rango';
  reservas: ReservaResponse[] = [];
  fechaIni: String = '';
  fechaFin: String = '';
  reporteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private reporteService: ReporteService
  ) {
    this.reporteForm = this.fb.group({
      sede_id: [0],
      cancha_id: [0],
      fecha_reserva: ['']
    });
  }

  ngOnInit(): void {
  }

  onFechaInicioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.fechaIni = target.value;
  }

  onFechaFinChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.fechaFin = target.value;
  }

  onSubmit(): void {
    this.reporteService.reporteRango(this.fechaIni, this.fechaFin).subscribe((result) => {
      console.log(result);
      this.reservas = result;
    })
  }

}
