import { Component } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';

import { SidebarService } from '../../services/sidebar/sidebar.service';
import { DatanavService } from './datanav.service';
import { MenuItem, SideBarData } from './sidebar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  base = '';
  page = '';
  currentUrl = '';
  public classAdd = false;

  public multilevel: Array<boolean> = [false, false, false];
  public sidebarData: Array<SideBarData> = [];

  constructor(
    private data: DatanavService,
    private router: Router,
    private sideBar: SidebarService
  ) {
    this.sidebarData = this.data.sideBar;
    router.events.subscribe((event: object) => {
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
}
