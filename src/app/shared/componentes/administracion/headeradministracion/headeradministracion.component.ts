import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminsidebarService } from 'src/app/shared/services/administracion/adminsidebar/adminsidebar.service';
import { OutloginService } from 'src/app/auth/services/outlogin.service';
import { RolesService } from 'src/app/shared/services/roles/roles.service';

@Component({
  selector: 'app-headeradministracion',
  templateUrl: './headeradministracion.component.html',
  styleUrls: ['./headeradministracion.component.scss'],
})
export class HeaderadministracionComponent implements OnInit {
  public openBox = false;
  public miniSidebar = false;
  public addClass = false;

  usuarionombre: any;
  usuariorol: any;
  dataRol: any = {};

  constructor(
    public router: Router,
    private sideBar: AdminsidebarService,
    private outloginService: OutloginService,
    private rolesService: RolesService
  ) {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
  }

  dataROLES: any;
  ngOnInit(): void {
    this.usuarionombre = localStorage.getItem('usernombre');
    //this.usuariorol = localStorage.getItem('userrol');
    this.rolesService.getRolesAll().subscribe({
      next: (data) => {
        //console.log(data);
        this.dataROLES = data;
        const datoRol = this.dataROLES.find(
          (rol: any) => rol.rol_id === localStorage.getItem('userrol')
        );
        if (datoRol) {
          //console.log(datoRol);
          this.dataRol = datoRol;
        }
      },
      error: (errorData) => {
        console.log(errorData);
      },
      complete: () => {},
    });
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
