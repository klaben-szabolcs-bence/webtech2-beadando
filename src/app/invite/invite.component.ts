import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors, AbstractControlOptions, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { matchPassword, MatchPasswordDirective } from '../match-password.directive';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  inviteForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar) {
    const formOptions: AbstractControlOptions = { validators: [matchPassword] };
    this.inviteForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
    }, formOptions);
  }

  hide = true;

  ngOnInit(): void {

  }

  registerUser(e: Event,
    username: HTMLInputElement,
    password: HTMLInputElement,
    confirmPassword: HTMLInputElement,
    email: HTMLInputElement) {
    e.preventDefault();

    if (username.value.length == 0
      || password.value.length == 0
      || confirmPassword.value.length == 0
      || email.value.length == 0) {
      return
    }

    if (username.value.length > 50
      || password.value.length < 6
      || confirmPassword.value.length < 6) {
      return
    }

    if (password.value != confirmPassword.value) {
      return
    }

    this.http.put('/api/register', {
      username: username.value,
      password: password.value,
      email: email.value
    }, { observe: "response" }).subscribe((res) => {
      if (res.status == 201) {
        this.snackBar.open("Successfully registered", "", { duration: 4000 });
      }
      else {
        this.snackBar.open("Error inviting", "", { duration: 4000, panelClass: ["notif-warn"] });
      }
    });
  }

  cancel(e: Event) {
    e.preventDefault();
    this.router.navigate(['/']);
  }
}
