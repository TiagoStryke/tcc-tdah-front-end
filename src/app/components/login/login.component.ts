import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private toastr: ToastrService,
    private service: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  hideShowPassword() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  testPassword() {}

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastr.error('Formulário Inválido!', 'Error');
      return;
    }
    let loginUser: User = {
      email: this.emailControl?.value || '',
      password: this.passwordControl?.value || '',
    };
    this.service.login(loginUser).subscribe({
      next: (response) => {
        this.toastr.success('Login efetuado com sucesso!', 'Sucesso');
        this.router.navigate(['/dashboard']);
        localStorage.setItem('token', response.token);
      },
      error: (error) => {
        this.toastr.error('Erro ao efetuar login!', 'Error');
      },
    });
  }
}
