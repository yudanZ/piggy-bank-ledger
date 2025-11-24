import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpendingEntry } from '../modals/spending.modals';
import { Wish } from '../../wish-list/modals/wish-list.models';
import { WorkEntry } from '../../earning/modals/earning.model';

@Injectable({ providedIn: 'root' })
export class SpendingService {
  private _httpClient = inject(HttpClient);
  private _baseUrl = 'http://localhost:3000/api/spending';

  public getSpending$(kidName: string): Observable<SpendingEntry[]> {
    return this._httpClient.get<SpendingEntry[]>(`${this._baseUrl}/${kidName}`);
  }

  public addSpending$(entry: SpendingEntry): Observable<void> {
    return this._httpClient.post<void>(this._baseUrl, entry);
  }

  public deleteSpending$(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this._baseUrl}/${id}`);
  }

  public getSpendingById$(kidName: string, id: number): Observable<Wish> {
    return this._httpClient.get<Wish>(`${this._baseUrl}/${kidName}/${id}`);
  }
}
