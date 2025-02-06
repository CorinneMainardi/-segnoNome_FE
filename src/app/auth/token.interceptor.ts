import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

//HttpInterceptorFn: funzione che modifica le richieste HTTP prima che vengano inviate al server.
export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  //prendo le info dal service
  const authSvc = inject(AuthService);

  //il token verfic se l'url contiene login e register.
  // Se l'URL contiene una di queste stringhe, l'interceptor non modifica la richiesta e la lascia proseguire al server così com'è, senza aggiungere alcun header Authorization.
  // La funzione next(request) viene chiamata per passare la richiesta originale (senza modifiche) al successivo handler nella catena HTTP.

  if (request.url.includes('/login') || request.url.includes('/register')) {
    return next(request);
  }

  // prendo il token dal local storage
  const token = localStorage.getItem('accessData');
  console.log('token trovato', token);
  //se il token non essite mi stampo l'errore
  if (!token) {
    console.warn('Token mancante nel localStorage');
  }

  // Clono la richiesta e aggiunge l'header Authorization solo se il token esiste
  const newRequest = token
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : request;
  //Passo la nuova richiesta, con il token, al prossimo passo della catena.
  return next(newRequest).pipe(
    catchError((error) => {
      console.error('Errore intercettato dall’interceptor:', error);
      return throwError(() => error); // Rilancia l'errore per la gestione successiva
    })
  );
};

// Interceptor aggiornato con token fisso da Swagger
// export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
//   const authSvc = inject(AuthService); // Utilizzo di `inject` per ottenere il servizio

//   // Token preso manualmente da Swagger per testing
//   const swaggerToken =
//     'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjcmVhdG9yIiwicm9sZXMiOlsiUk9MRV9DUkVBVE9SIl0sImlhdCI6MTczODc3ODE5MCwiZXhwIjoxNzM4NzgxNzkwfQ.mQ74Ofq7UsfxbJejJEuGApRxzh44IAhKBDI61Q9h_n0';

//   // Ignora l'interceptor per endpoint di login o altri non protetti
//   if (request.url.includes('/login') || request.url.includes('/register')) {
//     return next(request);
//   }

//   // Clona la richiesta e aggiunge l'header Authorization con il token fisso
//   const newRequest = request.clone({
//     setHeaders: {
//       Authorization: `Bearer ${swaggerToken}`, // Token preso da Swagger
//     },
//   });

//   return next(newRequest).pipe(
//     catchError((error) => {
//       console.error('Errore intercettato dall’interceptor:', error);
//       return throwError(() => error); // Rilancia l'errore per la gestione successiva
//     })
//   );
// };
