import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { AuthService } from '../auth.service';
import { iUser } from '../../interfaces/iuser';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  passwordVisible = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  generatedCaptcha: string = '';
  userInputCaptcha: string = '';

  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    username: FormControl<string>;
    captcha: FormControl<string>;
    agree: FormControl<boolean>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private authSvc: AuthService,
    private router: Router
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      captcha: ['', [Validators.required]],
      agree: [false, [Validators.requiredTrue]],
    });

    this.generateCaptcha();
  }

  //genero il captcha
  generateCaptcha(): void {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.generatedCaptcha = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  }

  //submit del form
  submitForm(): void {
    if (this.validateForm.valid) {
      this.register();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.errorMessage = '❌ Completa tutti i campi obbligatori.';
    }
  }

  //register solo se captcha corretto e regolamentio accettato
  register(): void {
    if (!this.validateForm.value.agree) {
      this.errorMessage = '❌ Devi accettare il regolamento per registrarti.';
      return;
    }

    if (this.validateForm.value.captcha !== this.generatedCaptcha) {
      this.errorMessage = '❌ Captcha errato. Riprova.';
      return;
    }

    const userData: iUser = {
      firstName: this.validateForm.value.firstName || '',
      lastName: this.validateForm.value.lastName || '',
      email: this.validateForm.value.email || '',
      password: this.validateForm.value.password || '',
      username: this.validateForm.value.username || '',
    };

    console.log('📤 Dati inviati al server:', userData);

    this.authSvc
      .register(userData)
      .pipe(
        catchError((err) => {
          console.error('❌ Errore durante la registrazione:', err);
          this.successMessage = null;

          if (err.status === 409) {
            this.errorMessage =
              '❌ Username già esistente. Scegli un altro username.';
          } else if (err.status === 400) {
            this.errorMessage = '❌ Registrazione fallita: dati non validi.';
          } else if (err.status === 201) {
            // 🔹 Ignoriamo il falso errore 201 e lo trattiamo come successo
            this.successMessage =
              '✅ Registrazione avvenuta con successo! Verrai reindirizzato al login.';
            this.errorMessage = null;
            setTimeout(() => this.router.navigate(['/login']), 1000);
            return of(null); // 🔹 Blocchiamo l'errore senza interrompere il flusso
          } else {
            this.errorMessage = '❌ Errore di connessione. Riprova più tardi.';
          }
          return of(null);
        })
      )
      .subscribe(() => {
        // ✅ Se la richiesta ha avuto successo, non entra nel catchError
        this.successMessage =
          '✅ Registrazione avvenuta con successo! Verrai reindirizzato al login.';
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/login']), 1000);
      });
  }
}
