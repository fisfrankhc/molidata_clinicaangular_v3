import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'ventas',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'clinica',
    loadChildren: () =>
      import('./clinica/clinica.module').then((m) => m.ClinicaModule),
  },
  {
    path: 'administracion',
    loadChildren: () =>
      import('.//administracion/administracion.module').then(
        (m) => m.AdministracionModule
      ),
  },
];

const routerOptions: ExtraOptions = {
  useHash: true,
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
