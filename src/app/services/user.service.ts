import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs';
import { iUser } from '../interfaces/iuser';
import { iVideoClass } from '../interfaces/i-video-class';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersUrl = environment.usersUrl;
  userUrl = environment.userUrl;

  constructor(private http: HttpClient) {}

  getAllUser() {
    return this.http.get<iUser[]>(this.usersUrl);
  }
  getCurrentUser() {
    return this.http.get<iUser>(this.userUrl);
  }

  addFavorite(userId: number, newFavorite: iVideoClass) {
    return this.getCurrentUser().pipe(
      switchMap((user) => {
        const favorites = user.favorites || [];

        if (!favorites.some((element) => element.id === newFavorite.id)) {
          favorites.push(newFavorite);
        }

        return this.http.patch<iUser>(this.userUrl, { favorites });
      })
    );
  }
  getAllFavorites() {
    return this.getCurrentUser().pipe(map((user) => user.favorites || []));
  }
}
