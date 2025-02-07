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

  user$ = this.authSubject$.asObservable().pipe(
    tap((accessData) => (this.isLoggedIn = !!accessData)),
    map((accessData) => (accessData ? accessData.user : null))
  );

  isLoggedIn$ = this.authSubject$.pipe(map((accessData) => !!accessData));

  // ottengo il token
  getToken(): string | null {
    const accessData = localStorage.getItem('accessData');
    return accessData ? JSON.parse(accessData) : null;
  }

  getUserRole(): string {
    const token = localStorage.getItem('accessData'); // 🔥 Legge solo il token
    if (!token) {
      console.warn('⚠️ Nessun token trovato in localStorage');
      return '';
    }

    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      console.log('📜 Token decodificato:', decodedToken);
      return decodedToken.roles?.[0] || ''; // Se non ci sono ruoli, restituisce ''
    } catch (error) {
      console.error('❌ Errore nella decodifica del token:', error);
      return '';
    }
  }

  register(newUser: Partial<iUser>) {
    return this.http.post<iAccessData>(this.registerUrl, newUser);
  }

  login(authData: Partial<iLoginRequest>) {
    return this.http.post<{ token: string }>(this.loginUrl, authData).pipe(
      tap((response) => {
        console.log('🔥 Login Success:', response);

        // ✅ Salva SOLO il token (senza salvare user separatamente)
        localStorage.setItem('accessData', response.token);

        // ✅ Estrai ruolo direttamente dal token
        const decodedToken: JwtPayload = jwtDecode(response.token);
        const userRole = decodedToken.roles?.[0] || '';

        console.log('🎭 Ruolo estratto dal token:', userRole);

        // ✅ Aggiorna il comportamento reattivo con token e ruolo
        const accessData: iAccessData = {
          token: response.token,
          user: {
            username: '',
            email: '',
            password: '',
            captcha: '',
            agree: false,
          }, // Puoi rimuoverlo se non serve
        };

        this.authSubject$.next(accessData);

        // ✅ Calcola la scadenza del token e imposta il logout automatico
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

  // restoreUser() {
  //   const userJson: string | null = localStorage.getItem('accessData');
  //   if (!userJson) return;

  //   const accessData: iAccessData = JSON.parse(userJson);
  //   if (this.jwtHelper.isTokenExpired(accessData.token)) {
  //     localStorage.removeItem('accessData');
  //     return;
  //   }

  //   this.authSubject$.next(accessData);
  // }

  restoreUser() {
    const token: string | null = localStorage.getItem('accessData');
    if (!token) return;

    if (this.jwtHelper.isTokenExpired(token)) {
      localStorage.removeItem('accessData');
      return;
    }

    this.authSubject$.next({ token, user: {} as iUser }); // Usa un oggetto vuoto per evitare errori
  }
}
