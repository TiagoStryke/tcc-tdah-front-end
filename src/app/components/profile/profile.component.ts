import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { JWT_token } from 'src/app/services/jwt.token';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/components/Interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  selectedFileName: string | undefined;
  token = localStorage.getItem('token');
  user: any;
  userId: any;
  photoTodataURL: string = '';
  userInfo = new FormGroup({
    username: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    password: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
  });

  constructor(
    private jwtToken: JWT_token,
    private toastr: ToastrService,
    private service: UserService,
    private router: Router
  ) {}

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event'])
  onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.dataTransfer) {
      const files = evt.dataTransfer.files;
      if (files.length > 0) {
        this.selectedFileName = files[0].name;
        this.handleFiles(files);
      }
    }
  }
  ngOnInit(): void {
    if (this.token) {
      this.user = this.jwtToken.decodeToken(this.token);
      this.userId = this.user.userId;
    } else {
      this.toastr.error('Erro efetue o Login novamente!', 'Error');
      this.router.navigate(['/login']);
    }

    this.findUserInfo();
  }
  onFileDropped(event: Event) {
    const input = event.target! as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  openFileSelectionDialog() {
    let fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
      fileInput.onchange = (event: any) => {
        if (event.target) {
          this.selectedFileName = event.target.files[0].name;
        }
      };
    }
  }

  handleFiles(file: FileList) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      let newWidth = 45;
      let newHeight = 45;
      let x = 0;
      let y = 0;
      if (aspectRatio >= 1) {
        newHeight = newWidth / aspectRatio;
        y = (45 - newHeight) / 2;
      } else {
        newWidth = newHeight * aspectRatio;
        x = (45 - newWidth) / 2;
      }
      canvas.width = 45;
      canvas.height = 45;
      if (ctx) {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, x, y, newWidth, newHeight);
      }
      this.photoTodataURL = canvas.toDataURL();
    };
    image.src = URL.createObjectURL(file[0]);
  }

  findUserInfo() {
    this.service.findById(this.userId).subscribe((res) => {
      this.userInfo.patchValue({
        username: res.body.name,
        email: res.body.email,
        password: res.body.password,
      });
    });
  }

  enableEdit(selector: String) {
    if (selector === 'username') {
      this.userInfo.controls.username.enable();
    }
    if (selector === 'email') {
      this.userInfo.controls.email.enable();
    }
    if (selector === 'password') {
      this.userInfo.controls.password.enable();
    }
  }

  saveEdit() {
    let editedUser: User = {
      _id: this.userId,
      name: this.userInfo.controls.username.value || '',
      email: this.userInfo.controls.email.value || '',
      password: this.userInfo.controls.password.value || '',
      profilePhoto: this.photoTodataURL,
    };
    this.service.edit(editedUser).subscribe((res) => {
      this.toastr.success('Dados atualizados com sucesso!', 'Sucesso');
      this.userInfo.controls.username.disable();
      this.userInfo.controls.email.disable();
      this.userInfo.controls.password.disable();
    });
  }
}
