import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('pippo');
    const newRequest = request.clone({
      headers: request.headers.set(
        'Authorization',
        `Bearer ${localStorage.getItem('accessData')}`
      ),
    });
    return next.handle(newRequest).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }
}

//   private tokenFisso: string =
//     'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjcmVhdG9yIiwicm9sZXMiOlsiUk9MRV9DUkVBVE9SIl0sImlhdCI6MTczODc1NDUwMCwiZXhwIjoxNzM4NzU4MTAwfQ.Mti-w-pnSsbiltwjCyYc_9FjHqqtw5VTtBs2SVIBsu4';

// //   intercept(
// //     request: HttpRequest<any>,
// //     next: HttpHandler
// //   ): Observable<HttpEvent<any>> {
// //     console.log('Interceptor attivato per:', request.url);

// //     // Cloniamo la richiesta per aggiungere il token
// //     const clonedRequest = request.clone({
// //       setHeaders: {
// //         Authorization: `Bearer ${this.tokenFisso}`,
// //       },
// //     });

// //     // Log per verificare l'header Authorization
// //     console.log(
// //       'Header Authorization:',
// //       clonedRequest.headers.get('Authorization')
// //     );

// //     return next.handle(clonedRequest);
// //   }
// // }
