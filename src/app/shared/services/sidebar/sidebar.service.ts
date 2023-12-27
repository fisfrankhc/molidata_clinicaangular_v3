import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DatanavService } from '../../componentes/sidebar/datanav.service';

interface MainMenu {
  menu: MenuItem[];
}
interface MenuItem {
  subMenus: any;
  menuValue: string;
  showSubRoute: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public toggleSideBar: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('isMiniSidebar') || 'false'
  );

  public toggleMobileSideBar: BehaviorSubject<string> =
    new BehaviorSubject<string>(
      localStorage.getItem('isMobileSidebar') || 'false'
    );

  public expandSideBar: BehaviorSubject<string> = new BehaviorSubject<string>(
    'false'
  );

  constructor(private data: DatanavService) {}

  /*   public switchSideMenuPosition(): void {
    if (localStorage.getItem('isMiniSidebar')) {
      this.toggleSideBar.next('false');
      localStorage.removeItem('isMiniSidebar');
      this.data.sideBar.map((mainMenus: MainMenu) => {
        mainMenus.menu.map((resMenu: MenuItem) => {
          const menuValue = sessionStorage.getItem('menuValue');
          if (menuValue && menuValue == resMenu.menuValue) {
            resMenu.showSubRoute = true;
          }
        });
      });
    } else {
      this.toggleSideBar.next('true');
      localStorage.setItem('isMiniSidebar', 'true');
      this.data.sideBar.map((mainMenus: MainMenu) => {
        mainMenus.menu.map((resMenu: MenuItem) => {
          resMenu.showSubRoute = false;
        });
      });
    }
  } */

  public switchSideMenuPosition(): void {
    if (localStorage.getItem('isMiniSidebar')) {
      this.toggleSideBar.next('false');
      localStorage.removeItem('isMiniSidebar');
      this.data.sideBar.map((mainMenus: MainMenu) => {
        mainMenus.menu.map((resMenu: MenuItem) => {
          resMenu.subMenus.map((subMenu: MenuItem) => {
            const menuValue = sessionStorage.getItem('menuValue');
            if (menuValue && menuValue == subMenu.menuValue) {
              subMenu.showSubRoute = true;
            }
          });
        });
      });
    } else {
      this.toggleSideBar.next('true');
      localStorage.setItem('isMiniSidebar', 'true');
      this.data.sideBar.map((mainMenus: MainMenu) => {
        mainMenus.menu.map((resMenu: MenuItem) => {
          resMenu.showSubRoute = false;
        });
      });
    }
  }

  public switchMobileSideBarPosition(): void {
    if (localStorage.getItem('isMobileSidebar')) {
      this.toggleMobileSideBar.next('false');
      localStorage.removeItem('isMobileSidebar');
    } else {
      this.toggleMobileSideBar.next('true');
      localStorage.setItem('isMobileSidebar', 'true');
    }
  }
}
