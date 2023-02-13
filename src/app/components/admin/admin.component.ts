import { Component } from '@angular/core';
import { DeleteUserModalComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  listOfUsers: any;
  constructor(
    private service: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getlistofUsers();
  }

  getlistofUsers() {
    this.service.list().subscribe((data) => {
      this.listOfUsers = data.body;
    });
  }

  deleteUser(username: string) {
    const dialogRef = this.dialog.open(DeleteUserModalComponent, {
      data: { username },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.delete(username).subscribe((data) => {
          this.toastr.success('Usuário deletado com sucesso');
          this.getlistofUsers();
        });
      }
    });
  }
}
