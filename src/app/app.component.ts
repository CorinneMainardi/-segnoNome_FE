import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isCollapsed = false;
  isLogged?: boolean;
  userRole: string = '';

  constructor(private authSvc: AuthService, private router: Router) {
    this.authSvc.isLoggedIn$.subscribe((logged) => {
      this.isLogged = logged;
      if (this.isLogged) {
        this.userRole = this.authSvc.getUserRole();
        console.log('ruolo assegnato:', this.userRole);
      }
    });
  }
  ngOnInit() {
    this.userRole = this.authSvc.getUserRole();
    console.log('ruolo assegnato:', this.userRole);
  }
  logout() {
    this.authSvc.logout();
    this.router.navigate(['/']);
  }
}
