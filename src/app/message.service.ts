import { Injectable } from '@angular/core';
import { Message } from './models/message';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) {

  }

  getMessages() {
    return this.http.get<Message[]>('api/messages');
  }
}
