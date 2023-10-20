import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../models/message';

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
  constructor() { }

  ngOnInit(): void {
  }

}
