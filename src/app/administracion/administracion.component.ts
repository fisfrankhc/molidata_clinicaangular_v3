import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AdminsidebarService } from 'src/app/shared/services/administracion/adminsidebar/adminsidebar.service';
import { AdminnavService } from 'src/app/shared/componentes/administracion/adminnav/adminnav.service';

import {
  MenuItem,
  SideBarData,
} from 'src/app/shared/componentes/administracion/adminnav/adminsidebar';

interface Route {
  url: string;
  // Add other properties if necessary
}

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss'],
})
export class AdministracionComponent {
  public miniSidebar = 'false';
  public expandMenu = 'false';
  public mobileSidebar = 'false';
  public sideBarActivePath = false;
  public headerActivePath = false;
  base = '';
  page = '';
  currentUrl = '';

  constructor(
    private sideBar: AdminsidebarService,
    public router: Router,
    private data: AdminnavService
  ) {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = 'true';
      } else {
        this.miniSidebar = 'false';
      }
    });

    this.sideBar.toggleMobileSideBar.subscribe((res: string) => {
      if (res == 'true' || res == 'true') {
        this.mobileSidebar = 'true';
      } else {
        this.mobileSidebar = 'false';
      }
    });

    this.sideBar.expandSideBar.subscribe((res: string) => {
      this.expandMenu = res;
      if (res == 'false' && this.miniSidebar == 'true') {
        this.data.sideBar.map((mainMenus: any) => {
          mainMenus.menu.map((resMenu: MenuItem) => {
            resMenu.showSubRoute = false;
          });
        });
      }
      if (res == 'true' && this.miniSidebar == 'true') {
        this.data.sideBar.map((mainMenus: any) => {
          mainMenus.menu.map((resMenu: MenuItem) => {
            const menuValue = sessionStorage.getItem('menuValue');
            if (menuValue && menuValue == resMenu.menuValue) {
              resMenu.showSubRoute = true;
            } else {
              resMenu.showSubRoute = false;
            }
          });
        });
      }
    });
    this.getRoutes(this.router);
  }
  public toggleMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }
  private getRoutes(route: Route): void {
    if (route.url.split('/')[2] === 'confirm-mail') {
      this.sideBarActivePath = false;
      this.headerActivePath = false;
    } else {
      this.sideBarActivePath = true;
      this.headerActivePath = true;
    }
  }
}
