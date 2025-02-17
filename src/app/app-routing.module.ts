import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { GuestGuard } from './auth/guest.guard';
import { RoleGuard } from './auth/role.guard';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomeModule),
    canActivate: [GuestGuard],
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
    path: 'user-detail',
    loadChildren: () =>
      import('./pages/user-detail/user-detail.module').then(
        (m) => m.UserDetailModule
      ),
    canActivate: [AuthGuard],
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

  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER'] },
  },

  {
    path: 'add-dictionary',
    loadChildren: () =>
      import('./pages/add-dictionary/add-dictionary.module').then(
        (m) => m.AddDictionaryModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_CREATOR'] },
  },
  {
    path: 'add-videoclass',
    loadChildren: () =>
      import('./pages/add-videoclass/add-videoclass.module').then(
        (m) => m.AddVideoclassModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_CREATOR'] },
  },
  {
    path: 'add-event',
    loadChildren: () =>
      import('./pages/add-event/add-event.module').then(
        (m) => m.AddEventModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_CREATOR'] },
  },
  {
    path: 'user-detail',
    loadChildren: () =>
      import('./pages/user-detail/user-detail.module').then(
        (m) => m.UserDetailModule
      ),
  },
  {
    path: 'lesson-interests',
    loadChildren: () =>
      import('./pages/lesson-interests/lesson-interests.module').then(
        (m) => m.LessonInterestsModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER'] },
  },
  {
    path: 'requests-management',
    loadChildren: () =>
      import('./pages/requests-management/requests-management.module').then(
        (m) => m.RequestsManagementModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_CREATOR'] },
  },
  {
    path: 'add-event',
    loadChildren: () =>
      import('./pages/add-event/add-event.module').then(
        (m) => m.AddEventModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_CREATOR'] },
  },
  {
    path: 'event-manage',
    loadChildren: () =>
      import('./pages/event-manage/event-manage.module').then(
        (m) => m.EventManageModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_CREATOR'] },
  },
  {
    path: 'admin-dashboard',
    loadChildren: () =>
      import('./pages/admin-dashboard/admin-dashboard.module').then(
        (m) => m.AdminDashboardModule
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },

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
