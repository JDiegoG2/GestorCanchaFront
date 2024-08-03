import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import {ToastrService}  from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: response => {
          // Guarda el token en localStorage
          localStorage.setItem('token', response.token);
          // Redirige al usuario a la página de reserva de habitación
          this.router.navigate(['/reserva-habitacion']);
        },
        error: error => {
          //this.toastr.error(error.mensaje);
          this.loginError = 'Usuario o contraseña incorrectos';
          this.toastr.error('Usuario o contraseña incorrectos');
        }
      });
    }
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
