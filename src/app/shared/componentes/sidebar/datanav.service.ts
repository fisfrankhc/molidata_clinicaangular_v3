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
          ],
          hasSubRoute: false,
          showSubRoute: false,
          base: 'dashboard',
          route: 'dashboard',
          img: 'assets/img/icons/menu-icon-01.svg',
          subMenus: [],
        },

        {
          menuValue: 'Roles',
          rol: [
            {
              valor: '1',
            },
          ],
          hasSubRoute: false,
          showSubRoute: false,
          base: 'doctor',
          route: 'roles',
          img: 'assets/img/icons/menu-icon-02.svg',
          subMenus: [],
        },

        {
          menuValue: 'Sucursal',
          rol: [
            {
              valor: '1',
            },
          ],
          hasSubRoute: false,
          showSubRoute: false,
          base: 'gallery',
          base2: 'profile',
          icon: 'fa-columns',
          faIcon: true,
          route: 'sucursal',
          subMenus: [],
        },

        {
          menuValue: 'Logistica',
          rol: [
            {
              valor: '1',
            },
          ],
          hasSubRoute: true,
          showSubRoute: false,
          base: 'reports',
          icon: 'fa-cube',
          faIcon: true,
          subMenus: [
            {
              menuValue: 'Categorias',
              route: 'logistica/categoria',
            },
            {
              menuValue: 'Compras',
              route: 'logistica/compra',
            },
            {
              menuValue: 'Productos',
              route: 'logistica/producto',
            },
            {
              menuValue: 'Proveedores',
              route: 'logistica/proveedores',
            },
            {
              menuValue: 'requerimientos',
              route: 'logistica/requerimientos',
            },
            {
              menuValue: 'Stock',
              route: 'logistica/stock',
            },
          ],
        },

        {
          menuValue: 'Farmacia',
          rol: [
            {
              valor: '1',
            },
            {
              valor: '2',
            },
          ],
          hasSubRoute: true,
          showSubRoute: false,
          base: 'payroll',
          img: 'assets/img/icons/menu-icon-09.svg',
          subMenus: [
            {
              menuValue: 'Ventas',
              route: 'farmacia/venta',
            },
            {
              menuValue: 'Clientes',
              route: 'farmacia/cliente',
            },
            {
              menuValue: 'caja',
              route: 'farmacia/caja',
            },
            {
              menuValue: 'Reporte de Caja',
              route: 'farmacia/reportecaja',
            },
            {
              menuValue: 'Inicio/cierre de Operaciones',
              route: 'farmacia/inicio-cierre-operaciones',
            },
          ],
        },
        {
          menuValue: 'Almacen',
          rol: [
            {
              valor: '1',
            },
          ],
          hasSubRoute: true,
          showSubRoute: false,
          base: 'invoice',
          img: 'assets/img/icons/menu-icon-15.svg',
          subMenus: [
            {
              menuValue: 'Generar Requerimiento',
              route: 'almacen/generar-requerimiento',
            },
            {
              menuValue: 'Movimientos de Almacen',
              route: 'almacen/movimientos-almacen',
            },
            {
              menuValue: 'Stock Sucursal',
              route: 'almacen/stock-sucursal',
            },
          ],
        },

        {
          menuValue: 'Contable',
          rol: [
            {
              valor: '1',
            },
          ],
          hasSubRoute: true,
          showSubRoute: false,
          base: 'blogs',
          route: 'sucursal',
          img: 'assets/img/icons/menu-icon-13.svg',
          subMenus: [
            {
              menuValue: 'Comprobantes',
              route: 'contable/comprobantes',
            },
            {
              menuValue: 'Reporte de Ventas - Sucursal',
              route: 'contable/reporte-ventas-por-sucursal',
            },
            {
              menuValue: 'Reporte de Ventas - Usuario',
              route: 'contable/reporte-ventas-por-usuario',
            },
          ],
        },

        {
          menuValue: 'Administracion',
          rol: [
            {
              valor: '1',
            },
          ],
          hasSubRoute: true,
          showSubRoute: false,
          base: 'blogs',
          route: 'sucursal',
          img: 'assets/img/icons/chat-icon-03.svg',
          subMenus: [
            {
              menuValue: 'Configurar Codigo',
              route: 'administracion/configurar-codigo-sucursal',
            },
          ],
        },
      ],
    },

    /* 
    {
      tittle: 'UI Elements',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Components',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'components',
          img: 'assets/img/icons/menu-icon-02.svg',
          subMenus: [
            {
              menuValue: 'UI Kit',
            },
            {
              menuValue: 'Typography',
            },
            {
              menuValue: 'Tabs',
            },
          ],
        },
        {
          menuValue: 'Forms',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'forms',
          icon: 'fa-edit',
          faIcon: true,
          subMenus: [
            {
              menuValue: 'Basic Inputs',
            },
            {
              menuValue: 'Input Groups',
            },
            {
              menuValue: 'Horizontal Form',
            },
            {
              menuValue: 'Vertical Form',
            },
          ],
        },
        {
          menuValue: 'Tables',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'tables',
          icon: 'fa-table',
          faIcon: true,
          subMenus: [
            {
              menuValue: 'Basic Tables',
            },
            {
              menuValue: 'Data Table',
            },
          ],
        },
        {
          menuValue: 'Calendar',
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'fa-calendar',
          faIcon: true,
          base: 'calendar',
          subMenus: [],
        },
      ],
    },
    {
      tittle: 'Extras',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Pages',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'gallery',
          base2: 'profile',
          icon: 'fa-columns',
          faIcon: true,
          subMenus: [
            {
              menuValue: 'Login',
            },
            {
              menuValue: 'Register',
            },
            {
              menuValue: 'Forgot Password',
            },
            {
              menuValue: 'Change Password',
            },
            {
              menuValue: 'Lock Screen',
            },
            {
              menuValue: 'Profile',
            },
            {
              menuValue: 'Gallery',
            },
            {
              menuValue: '404 Error',
            },
            {
              menuValue: '500 Error',
            },
          ],
        },
      ],
    },
     */
  ];
}
