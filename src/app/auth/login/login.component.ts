import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { iUser } from '../../interfaces/iuser';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: iUser | null = null;
  passwordVisible = false;
  errorMessage: string | null = null;
  validateForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private authSvc: AuthService,
    private router: Router
  ) {
    // Inizializza validateForm nel costruttore
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  // login() {
  //   if (this.validateForm.value) {
  //     this.authSvc.login(this.validateForm.value).subscribe((data) => {
  //       this.router.navigate(['/home']);
  //     });
  //   }
  // }
  // login() {
  //   if (this.validateForm.valid) {
  //     this.authSvc.login(this.validateForm.value).subscribe(() => {
  //       const userRoles = this.authSvc.getUserRole();
  //       console.log('Ruoli utente:', userRoles);

  //       if (userRoles.includes('ROLE_ADMIN')) {
  //         this.router.navigate(['/dataAnalysis']);
  //       } else if (userRoles.includes('ROLE_CREATOR')) {
  //         this.router.navigate(['/requests-management']);
  //       } else if (userRoles.includes('ROLE_USER')) {
  //         this.router.navigate(['/home']);
  //       } else {
  //         this.router.navigate(['/unauthorized']);
  //       }
  //     });
  //   }
  // }

  login(): void {
    if (this.validateForm.valid) {
      this.authSvc
        .login(this.validateForm.value)
        .pipe(
          catchError((err) => {
            console.error('❌ Errore durante il login:', err);

            //gestisco gli errori
            if (err.status === 401) {
              this.errorMessage = '❌ Credenziali errate. Riprova.';
            } else if (err.status === 500) {
              this.errorMessage =
                '❌ Errore interno del server. Riprova più tardi.';
            } else {
              this.errorMessage =
                '❌ Errore di connessione. Riprova più tardi.';
            }
            return of(null); // 🔹 Blocca l'errore senza interrompere il flusso
          })
        )
        .subscribe((response) => {
          if (response) {
            const userRoles = this.authSvc.getUserRole();
            console.log('Ruoli utente:', userRoles);

            if (userRoles.includes('ROLE_ADMIN')) {
              this.router.navigate(['/admin-dashboard']);
            } else if (userRoles.includes('ROLE_CREATOR')) {
              this.router.navigate(['/requests-management']);
            } else if (userRoles.includes('ROLE_USER')) {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/unauthorized']);
            }
          }
        });
    }
  }
}
