import { DefaultService } from './default.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApp } from '../components/Interfaces/response';
import { User } from '../components/Interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService extends DefaultService {
  constructor(private http: HttpClient) {
    super('user');
  }
  list(): Observable<ResponseApp<User[]>> {
    return this.http.get<ResponseApp<User[]>>(this.url);
  }

  findById(id: string): Observable<ResponseApp<User>> {
    return this.http.get<ResponseApp<User>>(`${this.url}/${id}`);
  }

  create(user: User): Observable<ResponseApp<User>> {
    return this.http.post<ResponseApp<User>>(this.url, user);
  }

  edit(user: User): Observable<ResponseApp<User>> {
    return this.http.put<ResponseApp<User>>(`${this.url}/${user._id}`, user);
  }

  delete(id: String): Observable<ResponseApp<User>> {
    return this.http.delete<ResponseApp<User>>(`${this.url}/${id}`);
  }

  login(user: User): Observable<any> {
    return this.http.post<ResponseApp<User>>(`${this.url}/login`, user);
  }

  insertGeneratedCode(user: User): Observable<ResponseApp<User>> {
    return this.http.put<ResponseApp<User>>(
      `${this.url}/${user._id}/code`,
      user
    );
  }

  listPatients(id: string): Observable<ResponseApp<User>> {
    return this.http.get<ResponseApp<User>>(`${this.url}/responsible/${id}`);
  }
}
