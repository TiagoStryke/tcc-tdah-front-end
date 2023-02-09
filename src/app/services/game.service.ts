import { DefaultService } from './default.service';
import { Game } from '../components/Interfaces/game';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApp } from '../components/Interfaces/response';
@Injectable({
  providedIn: 'root',
})
export class GameService extends DefaultService {
  constructor(private http: HttpClient) {
    super('game');
  }

  listGames(): Observable<ResponseApp<Game>> {
    return this.http.get<ResponseApp<Game>>(`${this.url}`);
  }
}
