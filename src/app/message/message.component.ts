import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() public message: Message = {
    id: "-1",
    senderId: "",
    timestamp: new Date(),
    content: ""
  };
  constructor() { }

  ngOnInit(): void {
  }

}
