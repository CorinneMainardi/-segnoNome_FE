import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { iUser } from '../interfaces/iuser';
import { iVideoClass } from '../interfaces/i-video-class';
import { iDictionary } from '../interfaces/i-dictionary';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersUrl = environment.usersUrl;
  userUrl = environment.userUrl;

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

  addFavoriteD(userId: number, newFavoriteD: iDictionary) {
    return this.getCurrentUser().pipe(
      switchMap((user) => {
        const favoritesD = user.favoritesD || [];

        if (!favoritesD.some((element) => element.id === newFavoriteD.id)) {
          favoritesD.push(newFavoriteD);
        }

        return this.http.patch<iUser>(this.userUrl, { favoritesD });
      })
    );
  }
  getAllFavorites(user: iUser) {
    return this.getCurrentUser().pipe(map((user) => user.favoritesD || []));
  }
}
