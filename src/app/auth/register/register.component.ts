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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;

    username: FormControl<string>;
    captcha: FormControl<string>;
    agree: FormControl<boolean>;
  }>;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone',
  };

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

  confirmationValidator: ValidatorFn = (
    control: AbstractControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private authSvc: AuthService,
    private router: Router
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      username: ['', [Validators.required]],
      captcha: ['', [Validators.required]],
      agree: [false],
    });
  }

  register() {
    const userData: iUser = {
      email: this.validateForm.value.email || '', // Valore di fallback se undefined
      password: this.validateForm.value.password || '', // Valore di fallback se undefined
      username: this.validateForm.value.username || '', // Valore di fallback se undefined
      captcha: this.validateForm.value.captcha || '', // Valore di fallback se undefined
      agree: this.validateForm.value.agree || false,
    };

    this.authSvc.register(userData).subscribe((res) => {
      this.router.navigate(['/login']);
    });
  }
}
