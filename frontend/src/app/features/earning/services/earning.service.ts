import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkEntry } from '../modals/earning.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EarningService {
  private readonly _httpClient = inject(HttpClient);

  private readonly _baseUrl = 'http://localhost:3000/api/earnings';

  public addWorkEntry$(entry: WorkEntry): Observable<void> {
    return this._httpClient.post<void>(this._baseUrl, entry);
  }

  public getKidHistory$(kidName: string): Observable<WorkEntry[]> {
    return this._httpClient.get<WorkEntry[]>(this.createUrl(kidName));
  }

  public deleteEntry$(id: number): Observable<void> {
    return this._httpClient.delete<void>(this.createUrl(id));
  }

  public updateEntry$(id: number, payload: Partial<WorkEntry>): Observable<void> {
    return this._httpClient.put<void>(this.createUrl(id), payload);
  }

  public getEntryById$(kidName: string, entryId: number): Observable<WorkEntry> {
    return this._httpClient.get<WorkEntry>(this.createUrl(kidName, entryId));
  }

  private createUrl(...parts: (string | number)[]): string {
    return [this._baseUrl, ...parts].join('/');
  }
}
