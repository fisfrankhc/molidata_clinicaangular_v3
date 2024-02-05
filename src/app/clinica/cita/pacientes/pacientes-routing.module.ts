import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacientesIndexComponent } from './pacientes-index/pacientes-index.component';
import { PacientesNuevoComponent } from './pacientes-nuevo/pacientes-nuevo.component';
import { PacientesEditarComponent } from './pacientes-editar/pacientes-editar.component';

const routes: Routes = [
  {
    path: '',
    component: PacientesIndexComponent,
  },
  {
    path: 'nuevo',
    component: PacientesNuevoComponent,
  },
  {
    path: 'editar/:paciente_id',
    component: PacientesEditarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacientesRoutingModule {}
