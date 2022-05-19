import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { User } from './models/user';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'userIdToName'
})
export class UserIdToNamePipe implements PipeTransform {

  constructor(private http: HttpClient) { }

  transform(value: number, ...args: unknown[]): Observable<string> {
    return this.http.get<User>(`/api/user?id=` + value).pipe(map(user => user.username));
  }

}
