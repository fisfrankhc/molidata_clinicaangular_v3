import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from '../shared/componentes/header/header.component';
import { SidebarComponent } from '../shared/componentes/sidebar/sidebar.component';

import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [AdminComponent, HeaderComponent, SidebarComponent],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
})
export class AdminModule {}
