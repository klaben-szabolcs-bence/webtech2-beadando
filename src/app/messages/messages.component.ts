import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { Message } from '../models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  @Input() public messages: Message[] = [];
  constructor(private _messagesService: MessageService) { }

  ngOnInit(): void {
    this._messagesService.getMessages().subscribe(data => {
      this.messages = data;
    });
  }

}
