import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatanavService {
  constructor() {}

  public sideBar = [
    {
      tittle: 'Main',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Dashboard',
          rol: [
            {
              valor: '1',
            },
            {
              valor: '2',
            },
            {
              valor: '3',
            },
            {
              valor: '4',
            },
            {
              valor: '5',
            },
            {
              valor: '6',
            },
            {
              valor: '7',
            },
            {
              valor: '8',
            },
          ],
          hasSubRoute: false,
          showSubRoute: false,
          base: 'dashboard',
          route: 'dashboard',
          img: 'assets/img/icons/menu-icon-01.svg',
          subMenus: [
            {
              menuValue: '',
              route: '',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '2',
                },
                {
                  valor: '3',
                },
                {
                  valor: '4',
                },
                {
                  valor: '5',
                },
                {
                  valor: '6',
                },
                {
                  valor: '7',
                },
                {
                  valor: '8',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}
