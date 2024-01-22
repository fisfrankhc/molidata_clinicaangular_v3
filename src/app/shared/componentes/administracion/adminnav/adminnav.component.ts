import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { AdminsidebarService } from 'src/app/shared/services/administracion/adminsidebar/adminsidebar.service';
import { AdminnavService } from './adminnav.service';

import { OutloginService } from 'src/app/auth/services/outlogin.service';

interface SubMenu {
  menuValue: string;
  route?: string;
  base?: string;
}

interface SideBarData {
  tittle: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: MenuItem[];
}

interface MenuItem {
  rol?: { valor: any }[];
  menuValue: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  base?: string;
  route?: string;
  img?: string;
  icon?: string;
  faIcon?: boolean;
  subMenus: MenuItem[];
}

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.scss'],
})
export class AdminnavComponent {
  base = '';
  page = '';
  currentUrl = '';
  public classAdd = false;

  public multilevel: Array<boolean> = [false, false, false];
  public sidebarData: Array<any> = [];

  constructor(
    private data: AdminnavService,
    private router: Router,
    private sideBar: AdminsidebarService,
    private outloginService: OutloginService
  ) {
    this.sidebarData = this.data?.sideBar || [];
    //console.log(this.sidebarData);
    router.events.subscribe((event: object) => {
      //console.log(event)
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.router);
  }

  public expandSubMenus(menu: MenuItem): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.sidebarData.map((mainMenus: SideBarData) => {
      mainMenus.menu.map((resMenu: MenuItem) => {
        if (resMenu.menuValue == menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }

        // Considerar roles dentro de subMenus
        resMenu.subMenus.map((subMenu: MenuItem) => {
          //console.log(subMenu);
          subMenu.showSubRoute = false;
        });
      });
    });
  }

  private getRoutes(route: { url: string }): void {
    const bodyTag = document.body;

    bodyTag.classList.remove('slide-nav');
    bodyTag.classList.remove('opened');
    this.currentUrl = route.url;

    const splitVal = route.url.split('/');

    this.base = splitVal[1];
    this.page = splitVal[2];
  }
  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sideBar.expandSideBar.next('true');
    } else {
      this.sideBar.expandSideBar.next('false');
    }
  }

  checkUserRole(roles: Array<{ valor: string }>): boolean {
    const userRol = localStorage.getItem('userrol');
    if (userRol && roles) {
      return roles.some((role) => role.valor === userRol);
    }
    return false;
  }

  logout() {
    this.outloginService.cerrarsesion();
  }
}
