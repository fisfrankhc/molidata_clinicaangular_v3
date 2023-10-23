import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SidebarService } from '../../services/sidebar/sidebar.service';
import { OutloginService } from 'src/app/auth/services/outlogin.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public openBox = false;
  public miniSidebar = false;
  public addClass = false;

  usuarionombre: any;
  usuariorol: any;

  constructor(public router: Router, private sideBar: SidebarService, private outloginService: OutloginService) {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });

    this.usuarionombre = localStorage.getItem('usernombre');
    //this.usuariorol = localStorage.getItem('userrol');
    if (localStorage.getItem('userrol') == '1') {
      this.usuariorol = 'ADMINISTRADOR';
    } else {
      this.usuariorol = 'EDITOR';
    }

  }

  openBoxFunc() {
    this.openBox = !this.openBox;
    /* eslint no-var: off */
    var mainWrapper = document.getElementsByClassName('main-wrapper')[0];
    if (this.openBox) {
      mainWrapper.classList.add('open-msg-box');
    } else {
      mainWrapper.classList.remove('open-msg-box');
    }
  }

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }
  public toggleMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();

    this.addClass = !this.addClass;
    /* eslint no-var: off */
    var root = document.getElementsByTagName('html')[0];
    /* eslint no-var: off */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var sidebar: any = document.getElementById('sidebar');

    if (this.addClass) {
      root.classList.add('menu-opened');
      sidebar.classList.add('opened');
    } else {
      root.classList.remove('menu-opened');
      sidebar.classList.remove('opened');
    }
  }


  logout() {
    this.outloginService.cerrarsesion();
  }
}
