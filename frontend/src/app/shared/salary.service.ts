import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SalaryLevel} from "./models/salary-level.models";


@Injectable({ providedIn: 'root' })
export class SalaryService {
  private readonly _httpClient =inject(HttpClient) ;

  private _api = 'http://localhost:3000/api';


  public getLevels$(): Observable<SalaryLevel[]> {
    return this._httpClient.get<SalaryLevel[]>(`${this._api}/levels`);
  }
}
