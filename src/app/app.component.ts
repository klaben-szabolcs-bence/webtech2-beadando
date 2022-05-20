import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from './models/user';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webtech2-beadando';
  constructor(public auth: AuthService,
     private dialog: MatDialog,
     private http: HttpClient,
     private snackbar: MatSnackBar)
     { }

  editSelf() {
    this.auth.getUserDetails(this.auth.LoggedInUser).subscribe(user => {
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        data: {
          user: user
        },
        minWidth: '25%'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result) {
          this.http.put(`/api/user`, {
            id: user.id,
            username: result.user.username,
            email: result.user.email,
            password: result.password
          }).subscribe(() => {
            this.auth.LoggedInUserName = result.user.username;
            this.snackbar.open('Your details have been updated', '', { duration: 2000 });
          });
        }
      });
    });
  }
}
