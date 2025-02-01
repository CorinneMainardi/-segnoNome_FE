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

  constructor(private authSvc: AuthService, private router: Router) {
    this.authSvc.isLoggedIn$.subscribe((logged) => (this.isLogged = logged));
  }
  ngOnInit() {}
  logout() {
    this.authSvc.logout();
    this.router.navigate(['/']);
  }
}
