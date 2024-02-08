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
          subMenus: [
            {
              menuValue: '',
              route: '',
              rol: [
                {
                  valor: '1',
                },
              ],
            },
          ],
        },
        {
          menuValue: 'Sucursal',
          rol: [
            {
              menuValue: '',
              route: '',
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
          subMenus: [
            {
              rol: [
                {
                  valor: '1',
                },
              ],
            },
          ],
        },

        {
          menuValue: 'Logistica',
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
          base: 'reports',
          icon: 'fa-cube',
          faIcon: true,
          subMenus: [
            {
              menuValue: 'Categorias',
              route: 'logistica/categoria',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '2',
                },
              ],
            },
            {
              menuValue: 'Compras',
              route: 'logistica/compra',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '2',
                },
              ],
            },
            {
              menuValue: 'Productos',
              route: 'logistica/producto',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '2',
                },
              ],
            },
            {
              menuValue: 'Proveedores',
              route: 'logistica/proveedores',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '2',
                },
              ],
            },
            {
              menuValue: 'Requerimientos',
              route: 'logistica/requerimientos',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '2',
                },
              ],
            },
            {
              menuValue: 'Stock Central',
              route: 'logistica/stock-central',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '2',
                },
              ],
            },
          ],
        },

        {
          menuValue: 'Despacho',
          rol: [
            {
              valor: '1',
            },
            {
              valor: '2',
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
          ],
          hasSubRoute: true,
          showSubRoute: false,
          base: 'despacho',
          img: 'assets/img/icons/menu-icon-09.svg',
          subMenus: [
            {
              menuValue: 'Ventas',
              route: 'despacho/venta',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '5',
                },
                {
                  valor: '6',
                },
              ],
            },
            {
              menuValue: 'Clientes',
              route: 'despacho/cliente',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '6',
                },
              ],
            },
            {
              menuValue: 'caja',
              route: 'despacho/caja',
              rol: [
                {
                  valor: '1',
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
            {
              menuValue: 'Reporte de Caja',
              route: 'despacho/reportecaja',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '6',
                },
                {
                  valor: '7',
                },
              ],
            },
            {
              menuValue: 'Inicio/cierre de Operaciones',
              route: 'despacho/inicio-cierre-operaciones',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '6',
                },
              ],
            },
          ],
        },
        {
          menuValue: 'Almacen',
          rol: [
            {
              valor: '1',
            },
            {
              valor: '5',
            },
            {
              valor: '8',
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
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '8',
                },
              ],
            },
            {
              menuValue: 'Movimientos de Almacen',
              route: 'almacen/movimientos-almacen',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '8',
                },
              ],
            },
            {
              menuValue: 'Stock Sucursal',
              route: 'almacen/stock-sucursal',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '8',
                },
              ],
            },
            {
              menuValue: 'Stock minimo',
              route: 'almacen/stock-minimo',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '5',
                },
              ],
            },
          ],
        },

        {
          menuValue: 'Contable',
          rol: [
            {
              valor: '1',
            },
            {
              valor: '3',
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
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '3',
                },
              ],
            },
            {
              menuValue: 'Reporte de Ventas - Sucursal',
              route: 'contable/reporte-ventas-por-sucursal',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '3',
                },
              ],
            },
            {
              menuValue: 'Reporte de Ventas - Usuario',
              route: 'contable/reporte-ventas-por-usuario',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '3',
                },
              ],
            },
            {
              menuValue: 'Asignacion de series',
              route: 'contable/asignacion-series',
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '3',
                },
              ],
            },
          ],
        },

        {
          menuValue: 'Administracion',
          rol: [
            {
              valor: '1',
            },
            {
              valor: '5',
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
              rol: [
                {
                  valor: '1',
                },
                {
                  valor: '5',
                },
              ],
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
