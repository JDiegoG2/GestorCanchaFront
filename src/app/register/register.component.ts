import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Register } from '../models/registerRequest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: Register = {
    password: '',
    nro_documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: ''
  };
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  register() {
    if (this.user.password !== this.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    }
    const patronDni = /^\d{8}$/;
    if (!patronDni.test(this.user.nro_documento)) {
      this.toastr.error('El nro de dni debe ser 8 digitos');
      return;
    }

    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.toastr.success('Registro exitoso');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Espera 2 segundos antes de redirigir
      },
      error: (error) => {
        this.toastr.error('Error en el registro: ' + error.error.mensaje);
      }
    });
  }
}
