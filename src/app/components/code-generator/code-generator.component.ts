import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { JWT_token } from '../../services/jwt.token';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../Interfaces/user';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-code-generator',
  templateUrl: './code-generator.component.html',
  styleUrls: ['./code-generator.component.scss'],
})
export class CodeGeneratorComponent {
  code = '';
  token = localStorage.getItem('token');
  user: any;
  userId: any;

  constructor(
    private clipboard: Clipboard,
    private jwtToken: JWT_token,
    private toastr: ToastrService,
    private service: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.token) {
      this.user = this.jwtToken.decodeToken(this.token);
      this.userId = this.user.userId;
    } else {
      this.toastr.error('Erro efetue o Login novamente!', 'Error');
      this.router.navigate(['/login']);
    }
  }

  generateCode() {
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.code = code;

    let userLogged: User = {
      _id: this.userId,
      generatedCode: [this.code],
    };
    this.service.insertGeneratedCode(userLogged).subscribe({
      next: (response) => {
        this.toastr.success('Código gerado com sucesso!', 'Sucesso');
      },
    });
  }

  copyToClipboard() {
    if (this.code) {
      this.clipboard.copy(this.code);
      this.toastr.success('Código copiado com sucesso!', 'Sucesso');
    } else {
      this.toastr.warning('Você deve gerar um código!', 'Error');
    }
  }
}
