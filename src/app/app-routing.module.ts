import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { GuestGuard } from './auth/guest.guard';
import { RoleGuard } from './auth/role.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomeModule),
    // canActivate: [GuestGuard],
  },

  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then((m) => m.RegisterModule),
    canActivate: [GuestGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
    canActivate: [GuestGuard],
  },
  {
    path: 'static-pages',
    loadChildren: () =>
      import('./static-pages/static-pages.module').then(
        (m) => m.StaticPagesModule
      ),
  },
  {
    path: 'videoclasses',
    loadChildren: () =>
      import('./pages/videoclasses/videoclasses.module').then(
        (m) => m.VideoclassesModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER'] },
  },
  {
    path: 'dictionary',
    loadChildren: () =>
      import('./pages/dictionary/dictionary.module').then(
        (m) => m.DictionaryModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER'] },
  },

  {
    path: 'videoclasses-manage',
    loadChildren: () =>
      import('./pages/videoclasses-manage/videoclasses-manage.module').then(
        (m) => m.VideoclassesManageModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_CREATOR'] },
  },
  {
    path: 'dictionary-manage',
    loadChildren: () =>
      import('./pages/dictionary-manage/dictionary-manage.module').then(
        (m) => m.DictionaryManageModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_CREATOR'] },
  },

  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./not-found/unauthorized/unauthorized.module').then(
        (m) => m.UnauthorizedModule
      ),
  },
  { path: 'lessons', loadChildren: () => import('./pages/lessons/lessons.module').then(m => m.LessonsModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  {
    path: '**',
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled', // Scrolla automaticamente alla sezione specificata dal fragment
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
