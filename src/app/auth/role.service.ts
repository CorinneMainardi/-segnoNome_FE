import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private authSvc: AuthService) {}

  isCreator(): boolean {
    return this.authSvc.getUserRole() === 'ROLE_CREATOR';
  }

  isAdmin(): boolean {
    return this.authSvc.getUserRole() === 'ROLE_ADMIN';
  }

  isUser(): boolean {
    return this.authSvc.getUserRole() === 'ROLE_USER';
  }
}
