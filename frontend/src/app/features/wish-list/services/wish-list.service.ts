import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wish } from '../modals/wish-list.models';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private _httpClient = inject(HttpClient);
  private _baseUrl = 'http://localhost:3000/api/wish-list';

  public getWishById$(id: number): Observable<Wish> {
    return this._httpClient.get<Wish>(this.createUrl(id));
  }

  public getWishesByKidName$(kidName: string): Observable<Wish[]> {
    return this._httpClient.get<Wish[]>(this.createUrl('kid', kidName));
  }

  public addWish$(wish: Wish): Observable<void> {
    return this._httpClient.post<void>(this._baseUrl, wish);
  }

  public updateWish$(id: number, payload: Partial<Wish>): Observable<void> {
    return this._httpClient.put<void>(this.createUrl(id), payload);
  }

  public deleteWish$(id: number): Observable<void> {
    return this._httpClient.delete<void>(this.createUrl(id));
  }

  private createUrl(...parts: (string | number)[]): string {
    return [this._baseUrl, ...parts].join('/');
  }
}
