export interface SubMenu {
  menuValue: string;
  route?: string;
  base?: string;
}

export interface SideBarData {
  tittle: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: MenuItem[];
}

export interface MenuItem {
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

/* export interface MenuItem {
  menuValue: string;
  rol?: { valor: string }[] | undefined;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  base: string;
  base2?: string;
  icon?: string;
  faIcon?: boolean;
  route?: string;
  subMenus: MenuItem[];
  img?: string;
} */

export interface SubMenuItem {
  menuValue?: string;
  route?: string;
  rol: { valor: string }[];
  base?: string;
}
