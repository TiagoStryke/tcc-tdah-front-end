import { DefaultService } from './default.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApp } from '../models/response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class PatientService extends DefaultService {
  constructor(private http: HttpClient) {
    super('patient');
  }

  listPatients(id: string): Observable<ResponseApp<User>> {
    return this.http.get<ResponseApp<User>>(`${this.url}/responsible/${id}`);
  }
}
