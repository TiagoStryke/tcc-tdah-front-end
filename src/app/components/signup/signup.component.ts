import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { ResponseApp } from 'src/app/components/Interfaces/response';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/components/Interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';

  signupForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    [this.checkPasswords]
  );

  constructor(
    private toastr: ToastrService,
    private service: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let updateInProgress = false;

    this.signupForm.valueChanges.subscribe((value) => {
      if (updateInProgress) {
        return;
      }
      updateInProgress = true;

      this.name.setValue(value.firstName + ' ' + value.lastName);
      updateInProgress = false;
    });
  }

  checkPasswords(control: AbstractControl) {
    return control.get('password')!.value ===
      control.get('confirmPassword')!.value
      ? null
      : { notSame: true };
  }

  hideShowPassword() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  get name(): FormControl {
    return this.signupForm.get('name') as FormControl;
  }

  get firstName() {
    return this.signupForm.get('firstName');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get emailControl() {
    return this.signupForm.get('email');
  }

  get passwordControl() {
    return this.signupForm.get('password');
  }

  get confirmPasswordControl() {
    return this.signupForm.get('confirmPassword');
  }

  signup() {
    if (this.signupForm.invalid) {
      this.toastr.error('Formulário Inválido!', 'Error');
      return;
    }

    let signupUser: User = {
      name: this.name?.value || '',
      email: this.emailControl?.value || '',
      password: this.passwordControl?.value || '',
    };

    this.service.create(signupUser).subscribe((response: ResponseApp<User>) => {
      if (response.error) {
        this.toastr.error(response.message, 'Error');
      } else {
        this.toastr.success(response.message, 'Success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);
      }
    });
  }
}
