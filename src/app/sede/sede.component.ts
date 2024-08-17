import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SedeService } from '../services/sede.service';
import { UbigeoService } from '../services/ubigeo.service';
import { Sede } from '../models/sede.model';

@Component({
  selector: 'app-sede',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.css']
})
export class SedeComponent implements OnInit {
  title = 'Listado de Sedes';
  sedeForm: FormGroup;
  sedeAPI: Sede[] = [];
  departamentos: string[] = [];
  provincias: string[] = [];
  distritos: any[] = [];
  editing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sedeService: SedeService,
    private ubigeoService: UbigeoService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.sedeForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      estado: [true, Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSedes();
    this.loadDepartamentos();
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

  private loadDepartamentos(): void {
    this.ubigeoService.listarDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: (err) => {
        console.error('Error al cargar departamentos: ', err);
        this.toastr.error('Error al cargar departamentos');
      }
    });
  }

  onDepartamentoChange(): void {
    const departamento = this.sedeForm.get('departamento')?.value;
    if (departamento) {
      this.ubigeoService.listarProvincias(departamento).subscribe({
        next: (data) => {
          this.provincias = data;
          this.distritos = []; // Resetea distritos cuando cambia el departamento
          this.sedeForm.patchValue({ provincia: '', distrito: '' });
        },
        error: (err) => {
          console.error('Error al cargar provincias: ', err);
          this.toastr.error('Error al cargar provincias');
        }
      });
    } else {
      this.provincias = [];
      this.distritos = [];
      this.sedeForm.patchValue({ provincia: '', distrito: '' });
    }
  }

  onProvinciaChange(): void {
    const departamento = this.sedeForm.get('departamento')?.value;
    const provincia = this.sedeForm.get('provincia')?.value;
    if (departamento && provincia) {
      this.ubigeoService.listarDistritos(departamento, provincia).subscribe({
        next: (data) => {
          console.log('Distritos cargados:', data); // <-- Añade este log
          this.distritos = data;
          this.sedeForm.patchValue({ distrito: '' });
        },
        error: (err) => {
          console.error('Error al cargar distritos: ', err);
          this.toastr.error('Error al cargar distritos');
        }
      });
    } else {
      this.distritos = [];
      this.sedeForm.patchValue({ distrito: '' });
    }
  }
  

  onSubmit(): void {
    if (this.sedeForm.valid) {
      const formValue = this.sedeForm.value;
  
      const sedeToSave: Sede = {
        id: formValue.id,
        nombre: formValue.nombre,
        direccion: formValue.direccion,
        telefono: formValue.telefono,
        estado: formValue.estado,
        ubigeo: {
          id: formValue.distrito // Aquí asegúrate de pasar el ID del distrito
        }
      };
  
      if (this.editing) {
        this.sedeService.actualizarSede(sedeToSave.id, sedeToSave).subscribe({
          next: (resp) => {
            this.loadSedes(); // Recargar la lista de sedes
            this.toastr.success('Sede actualizada correctamente.');
            this.sedeForm.reset();
            this.editing = false;
          },
          error: (err) => {
            console.error('Error al actualizar la sede: ', err);
            this.toastr.error('Error al actualizar la sede');
          }
        });
      } else {
        this.sedeService.crearSede(sedeToSave).subscribe({
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
      }
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

  toggleEstado(sede: Sede): void {
    const nuevoEstado = !sede.estado;
    this.sedeService.actualizarEstado(sede.id, nuevoEstado).subscribe(
      updatedSede => {
        sede.estado = nuevoEstado; // Actualiza el estado en la lista de sedes
        this.toastr.success('Estado de la sede actualizado correctamente');
      },
      error => {
        console.error('Error al actualizar el estado de la sede', error);
        this.toastr.error('Error al actualizar el estado de la sede');
      }
    );
  }

  editSede(sede: Sede): void {
    this.editing = true;
    this.sedeForm.setValue({
      id: sede.id,
      nombre: sede.nombre,
      direccion: sede.direccion,
      telefono: sede.telefono,
      estado: sede.estado,
      departamento: sede.departamento || '', 
      provincia: sede.provincia || '', 
      distrito: sede.distrito || '' 
    });

    if (sede.departamento) {
      this.onDepartamentoChange(); // Cargar provincias
    }

    if (sede.provincia) {
      this.onProvinciaChange(); // Cargar distritos
    }
  }

  trackById(index: number, item: Sede): any {
    return item.id;
  }
}