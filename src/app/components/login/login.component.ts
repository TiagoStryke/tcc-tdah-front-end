import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  login: string = '';
  password: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  hideShowPassword(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye': this.eyeIcon  = 'fa-eye-slash';
    this.isText ? this.type = 'text' : this.type = 'password';
  }

  onSubmit(event: any) {
    console.log(event)
  }

  testPassword(){

  }

}
