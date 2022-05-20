import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesComponent } from './messages/messages.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { LoginComponent } from './login/login.component';
import { MessageComponent } from './message/message.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MessageService } from './message.service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { UserIdToNamePipe } from './user-id-to-name.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { InviteComponent } from './invite/invite.component';
import { AbstractToFormControlPipe } from './abstract-to-form-control.pipe';
import { MatchPasswordDirective } from './match-password.directive';
import { ErrorStateMatcher } from '@angular/material/core';
import { TouchedErrorStateMatcher } from './touched-error-state.matcher';


@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    NewMessageComponent,
    LoginComponent,
    MessageComponent,
    PageNotFoundComponent,
    UserIdToNamePipe,
    InviteComponent,
    AbstractToFormControlPipe,
    MatchPasswordDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  providers: [CookieService, MessageService, AuthService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  bootstrap: [AppComponent]
})
export class AppModule { }
