import { iAccessData } from './../interfaces/iaccess-data';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, tap } from 'rxjs';
import { iUser } from '../interfaces/iuser';
import { iLoginRequest } from '../interfaces/iloginrequest';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  // miseve per prendermi i ruoli
  sub: string;
  roles: string[];
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }
  jwtHelper: JwtHelperService = new JwtHelperService();
  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;
  authSubject$ = new BehaviorSubject<iAccessData | null>(null);
  autoLogoutTimer: any;

  isLoggedIn: boolean = false;

  user$ = this.authSubject$
    .asObservable() //contiene dati sull'utente se è loggato
    .pipe(
      tap((accessData) => (this.isLoggedIn = !!accessData)),
      map((accessData) => {
        return accessData ? accessData.user : null;
      })
    );
  isLoggedIn$ = this.authSubject$.pipe(map((accessData) => !!accessData));

  // ottengo il token
  getToken(): string | null {
    const accessData = localStorage.getItem('accessData');
    return accessData ? JSON.parse(accessData) : null;
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      return decodedToken.roles && decodedToken.roles.length > 0
        ? decodedToken.roles[0]
        : '';
    } catch (error) {
      console.error('Errore nella decodifica del token:', error);
      return '';
    }
  }

  register(newUser: Partial<iUser>) {
    return this.http.post<iAccessData>(this.registerUrl, newUser);
  }
  // login(authData: Partial<iLoginRequest>) {
  //   return this.http.post<iAccessData>(this.loginUrl, authData).pipe(
  //     tap((accessData) => {
  //       this.authSubject$.next(accessData);
  //       console.log('AuthService isLoggedIn$: ', this.isLoggedIn$);
  //       localStorage.setItem('accessData', JSON.stringify(accessData));

  //       const expDate: Date | null = this.jwtHelper.getTokenExpirationDate(
  //         accessData.accessToken
  //       );

  //       if (!expDate) return;

  //       // logout automatico.
  //       this.autoLogout(expDate);
  //     })
  //   );
  // }

  login(authData: Partial<iLoginRequest>) {
    return this.http.post<{ token: string }>(this.loginUrl, authData).pipe(
      tap((response) => {
        console.log(' Login Success:', response); // DEBUG

        const accessData: iAccessData = {
          token: response.token, // ✅ Salva il token
          user: {
            username: '',
            email: '',
            password: '',
            captcha: '',
            agree: false,
          },
        };

        localStorage.setItem('accessData', JSON.stringify(accessData.token));
        this.authSubject$.next(accessData);

        const expDate: Date | null = this.jwtHelper.getTokenExpirationDate(
          response.token
        );
        if (!expDate) return;

        this.autoLogout(expDate);
      })
    );
  }

  logout() {
    this.authSubject$.next(null);
    localStorage.removeItem('accessData');
    this.router.navigate(['/login']);
  }

  autoLogout(expDate: Date) {
    const expMs = expDate.getTime() - new Date().getTime();
    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser() {
    const userJson: string | null = localStorage.getItem('accessData');
    if (!userJson) return;

    const accessData: iAccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.token)) {
      localStorage.removeItem('accessData');
      return;
    }

    this.authSubject$.next(accessData);
  }
}
