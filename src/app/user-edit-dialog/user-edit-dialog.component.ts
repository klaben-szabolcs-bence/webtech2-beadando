import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControlOptions, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { matchPassword } from '../match-password.directive';
import { User } from '../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {

  public user: User = {
    _id: '',
    id: -1,
    username: '',
    email: '',
    admin: false
  };

  public form: FormGroup;

  constructor(public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, password: String },
    private formBuilder: FormBuilder) {
    this.user = data.user;
    const formOptions: AbstractControlOptions = { validators: [matchPassword] };
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.maxLength(50)]),
      password: new FormControl('', [Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.minLength(6)]),
      email: new FormControl('', [Validators.email]),
    }, formOptions);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
