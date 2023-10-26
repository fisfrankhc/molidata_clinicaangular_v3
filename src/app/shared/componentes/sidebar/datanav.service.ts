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
          hasSubRoute: false,
          showSubRoute: false,
          base: 'dashboard',
          route: 'dashboard',
          img: 'assets/img/icons/menu-icon-01.svg',
          subMenus: [],
        },

        {
          menuValue: 'Logistica',
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
              menuValue: 'Productos',
              route: 'logistica/producto',
            },
          ],
        },
        {
          menuValue: 'Farmacia',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'payroll',
          img: 'assets/img/icons/menu-icon-09.svg',
          subMenus: [
            {
              menuValue: 'Venta',
              route: 'farmacia/venta',
            },
            /*             {
              menuValue: 'Payments',
            },
            {
              menuValue: 'Expenses',
            },
            {
              menuValue: 'Taxes',
            },
            {
              menuValue: 'Provident Fund',
            }, */
          ],
        },
        /* 
        {
          menuValue: 'Doctors',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'doctor',
          img: 'assets/img/icons/menu-icon-02.svg',
          subMenus: [
            {
              menuValue: 'Doctor List',
            },
            {
              menuValue: 'Add Doctor',
            },
            {
              menuValue: 'Edit Doctor',
            },
            {
              menuValue: 'Doctor Profile',
            },
          ],
        },
        {
          menuValue: 'Patients',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'patient',
          img: 'assets/img/icons/menu-icon-03.svg',
          subMenus: [
            {
              menuValue: 'Patients List',
            },
            {
              menuValue: 'Add Patients',
            },
            {
              menuValue: 'Edit Patients',
            },
            {
              menuValue: 'Patients Profile',
            },
          ],
        },
        {
          menuValue: 'Staff',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'staff',
          img: 'assets/img/icons/menu-icon-08.svg',
          subMenus: [
            {
              menuValue: 'Staff List',
            },
            {
              menuValue: 'Add Staff',
            },
            {
              menuValue: 'Staff Profile',
            },
            {
              menuValue: 'Leaves',
            },
            {
              menuValue: 'Holidays',
            },
            {
              menuValue: 'Attendance',
            },
          ],
        },
        {
          menuValue: 'Appointments',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'appointments',
          img: 'assets/img/icons/menu-icon-04.svg',
          subMenus: [
            {
              menuValue: 'Appointment List',
            },
            {
              menuValue: 'Book Appointment',
            },
            {
              menuValue: 'Edit Appointment',
            },
          ],
        },
        {
          menuValue: 'Doctor Schedule',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'doctor-schedule',
          img: 'assets/img/icons/menu-icon-05.svg',
          subMenus: [
            {
              menuValue: 'Schedule List',
            },
            {
              menuValue: 'Book Appointment',
            },
            {
              menuValue: 'Edit Appointment',
            },
          ],
        },
        {
          menuValue: 'Departments',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'departments',
          img: 'assets/img/icons/menu-icon-06.svg',
          subMenus: [
            {
              menuValue: 'Department List',
            },
            {
              menuValue: 'Add Department',
            },
            {
              menuValue: 'Edit Department',
            },
          ],
        },
        {
          menuValue: 'Accounts',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'accounts',
          img: 'assets/img/icons/menu-icon-07.svg',
          subMenus: [
            {
              menuValue: 'Invoices',
            },
            {
              menuValue: 'Payments',
            },
            {
              menuValue: 'Expenses',
            },
            {
              menuValue: 'Taxes',
            },
            {
              menuValue: 'Provident Fund',
            },
          ],
        },
        {
          menuValue: 'Payroll',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'payroll',
          img: 'assets/img/icons/menu-icon-09.svg',
          subMenus: [
            {
              menuValue: 'Employee Salary',
            },
            {
              menuValue: 'Payslip',
            },
          ],
        },
        {
          menuValue: 'Chat',
          hasSubRoute: false,
          showSubRoute: false,
          base: 'chat',
          img: 'assets/img/icons/menu-icon-10.svg',
          subMenus: [],
        },
        {
          menuValue: 'Call',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'calls',
          img: 'assets/img/icons/menu-icon-11.svg',
          subMenus: [
            {
              menuValue: 'Voice Call',
            },
            {
              menuValue: 'Video Call',
            },
            {
              menuValue: 'Incoming Call',
            },
          ],
        },
        {
          menuValue: 'Email',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'email',
          img: 'assets/img/icons/menu-icon-12.svg',
          subMenus: [
            {
              menuValue: 'Compose Mail',
            },
            {
              menuValue: 'Inbox',
            },
            {
              menuValue: 'Mail View',
            },
          ],
        },
        {
          menuValue: 'Blog',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'blogs',
          img: 'assets/img/icons/menu-icon-13.svg',
          subMenus: [
            {
              menuValue: 'Blog',
            },
            {
              menuValue: 'Blog View',
            },
            {
              menuValue: 'Add Blog',
            },
            {
              menuValue: 'Edit Blog',
            },
          ],
        },
        {
          menuValue: 'Assets',
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'fa-cube',
          faIcon: true,
          base: 'assets',
          subMenus: [],
        },
        {
          menuValue: 'activities',
          hasSubRoute: false,
          showSubRoute: false,
          img: 'assets/img/icons/menu-icon-14.svg',
          base: 'activities',
          subMenus: [],
        },
        {
          menuValue: 'Reports',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'reports',
          img: 'assets/img/icons/menu-icon-02.svg',
          subMenus: [
            {
              menuValue: 'Expense Report',
            },
            {
              menuValue: 'Invoice Report',
            },
          ],
        },
        {
          menuValue: 'Invoice',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'invoice',
          img: 'assets/img/icons/menu-icon-15.svg',
          subMenus: [
            {
              menuValue: 'Invoices List',
            },
            {
              menuValue: 'Invoice Grid',
            },
            {
              menuValue: 'Add Invoices',
            },
            {
              menuValue: 'Edit Invoices',
            },
            {
              menuValue: 'Invoices Details',
            },
            {
              menuValue: 'Invoices Settings',
            },
          ],
        },
        {
          menuValue: 'Settings',
          hasSubRoute: false,
          showSubRoute: false,
          img: 'assets/img/icons/menu-icon-16.svg',
          base: 'settings',
          subMenus: [],
        }, */
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
