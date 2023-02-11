import { DefaultService } from './default.service';
import { GameResults } from '../components/Interfaces/gameResults';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApp } from '../components/Interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class GameResultsService extends DefaultService {
  constructor(private http: HttpClient) {
    super('game-result');
  }

  listResultsbyPeriod(
    patientId: string,
    gameId: string,
    dateStart: string,
    dateEnd: string,
    sound: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/patient/${patientId}/game/${gameId}/${dateStart}/${dateEnd}/${sound}`
    );
  }

  listResultsAverage(
    patientId: string,
    gameId: string,
    dateStart: string,
    dateEnd: string,
    sound: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/patient/${patientId}/game/${gameId}/${dateStart}/${dateEnd}/${sound}/average`
    );
  }

  listResultsMonthAverage(
    patientId: string,
    gameId: string,
    dateStart: string,
    dateEnd: string,
    sound: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/patient/${patientId}/game/${gameId}/${dateStart}/${dateEnd}/${sound}/monthaverage`
    );
  }

  listResultsYearAverage(
    patientId: string,
    gameId: string,
    dateStart: string,
    dateEnd: string,
    sound: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/patient/${patientId}/game/${gameId}/${dateStart}/${dateEnd}/${sound}/yearaverage`
    );
  }
}
