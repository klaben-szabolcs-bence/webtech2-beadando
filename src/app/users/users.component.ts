import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @Input() public users: User[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.updateUsers();
  }

  public updateUsers() {
    this.http.get<User[]>('api/users').subscribe(data => {
      this.users = data;
    });
  }
}
