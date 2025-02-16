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

  login() {
    if (this.validateForm.valid) {
      this.authSvc.login(this.validateForm.value).subscribe({
        next: () => {
          const userRoles = this.authSvc.getUserRole();
          console.log('Ruoli utente:', userRoles);

          if (userRoles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/dataAnalysis']);
          } else if (userRoles.includes('ROLE_CREATOR')) {
            this.router.navigate(['/requests-management']);
          } else if (userRoles.includes('ROLE_USER')) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/unauthorized']);
          }
        },
        error: (err) => {
          console.error('❌ Errore durante il login:', err);
          this.errorMessage =
            err.status === 401
              ? '❌ Credenziali errate. Riprova.'
              : '❌ Errore di connessione. Riprova più tardi.';
        },
      });
    }
  }
}
