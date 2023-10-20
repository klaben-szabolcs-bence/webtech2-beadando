import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user';
import { UsersComponent } from '../users/users.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input() public user: User = {
    _id: '',
    id: -1,
    username: '',
    email: '',
    admin: false
  };

  @Input() users: (UsersComponent | null) = null;

  constructor(public auth: AuthService, private http: HttpClient, private snackbar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public onDelete() {
    this.http.delete(`/api/user`, { body: { id: this.user.id } }).subscribe(() => {
      this.snackbar.open('User deleted', '', { duration: 2000 });
      this.users?.updateUsers();
    });
  }

  public toggleAdmin() {
    this.http.put(`/api/user`, {
      id: this.user.id,
      admin: !this.user.admin
    }).subscribe(() => {
      this.user.admin = !this.user.admin;
      if (this.user.id == this.auth.LoggedInUser) {
        this.auth.Admin = this.user.admin;
      }
      this.snackbar.open('User admin status changed', '', { duration: 2000 });
    });
  }

  public editUser() {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: {
        user: this.user
      },
      minWidth: '25%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.http.put(`/api/user`, {
          id: this.user.id,
          username: result.user.username,
          email: result.user.email,
          password: result.password
        }).subscribe(() => {
          this.users?.updateUsers();
          if (this.auth.LoggedInUser === this.user.id) {
            this.auth.LoggedInUserName = result.user.username;
          }
          this.snackbar.open('User updated', '', { duration: 2000 });
        });
      }
      else {
        this.users?.updateUsers();
      }
    });
  }
}