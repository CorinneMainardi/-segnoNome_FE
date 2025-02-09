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
  passwordVisible = false;

  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
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
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      captcha: ['', [Validators.required]],
      agree: [false],
    });
  }

  register() {
    const userData: iUser = {
      firstName: this.validateForm.value.firstName || '',
      lastName: this.validateForm.value.lastName || '',
      email: this.validateForm.value.email || '',
      password: this.validateForm.value.password || '',
      username: this.validateForm.value.username || '',
      captcha: this.validateForm.value.captcha || '',
      agree: this.validateForm.value.agree || false,
    };

    this.authSvc.register(userData).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
