import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { HttpClient } from '@angular/common/http';
import { MessagesComponent } from '../messages/messages.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() public message: Message = {
    _id: '',
    id: -1,
    senderId: -1,
    timestamp: new Date(),
    content: ""
  };

  @Input() messages: (MessagesComponent | null) = null;

  constructor(private http: HttpClient, public auth: AuthService) { }

  ngOnInit(): void {
  }

  onDelete() {
    this.http.delete(`/api/message`, { body: { id: this.message.id } }).subscribe(() => {
      this.messages?.updateMessages();
    });
  }

}
