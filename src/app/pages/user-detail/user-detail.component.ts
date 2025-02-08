import { DictionaryService } from './../../services/dictionary.service';
import { Component } from '@angular/core';
import { iAccessData } from '../../interfaces/iaccess-data';
import { Subject } from 'rxjs/internal/Subject';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { iDictionary } from '../../interfaces/i-dictionary';
import { iUser } from '../../interfaces/iuser';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  favorites: iDictionary[] = [];
  id!: number;
  user!: iUser;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private userSvc: UserService
  ) {}
  ngOnInit() {
    // this.autoLogout();
    this.authSvc.restoreUser();
    this.getCurrentUser();
    if (this.user.favoritesD) this.favorites = this.user.favoritesD;
  }

  getCurrentUser() {
    this.userSvc
      .getCurrentUser()
      .subscribe((response) => (this.user = response));
  }
}
