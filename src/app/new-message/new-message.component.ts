import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MessagesComponent } from '../messages/messages.component';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {

  @Input() messages: (MessagesComponent | null) = null;

  contentFormControl = new FormControl('', [Validators.required, Validators.maxLength(1000) ]);

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit(): void {
  }

  sendMessage(e: Event, content: HTMLTextAreaElement) {
    e.preventDefault();
    console.log(content.value + " " + this.auth.LoggedInUser);

    if (content.value.length == 0 || content.value.length > 1000) {
      return
    }

    this.http.put('/api/message', { "content": content.value, "senderId": this.auth.LoggedInUser }).subscribe(res => {
      content.value = '';
      this.messages?.updateMessages();
    });
  }
}
