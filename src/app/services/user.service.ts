import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { iUser } from '../interfaces/iuser';

import { iDictionary } from '../interfaces/i-dictionary';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersUrl = environment.usersUrl;
  userUrl = environment.userUrl;
  addFavoriteUrl = environment.addFavoriteUrl;
  getFavoritesUrl = environment.getFavoritesUrl;
  constructor(private http: HttpClient) {}
  uploadImage(userId: number, imageBase64: string): Observable<iUser> {
    return this.http.put<iUser>(`${this.userUrl}/${userId}/upload-image`, {
      img: imageBase64,
    });
  }

  getAllUser() {
    return this.http.get<iUser[]>(this.usersUrl);
  }
  getCurrentUser() {
    return this.http.get<iUser>(this.userUrl);
  }

  addFavoriteD(dictionaryId: number): Observable<iUser> {
    return this.http.put<iUser>(`${this.addFavoriteUrl}/${dictionaryId}`, {});
  }

  getAllFavorites(): Observable<iDictionary[]> {
    return this.http.get<iDictionary[]>(this.getFavoritesUrl);
  }
}
