

export interface SubMenu {
  menuValue: string;
  route?: string;
  base?: string;
 
}

export interface MenuItem {
  menuValue: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  base: string;
  route?: string;
  img?: string;
  icon?: string;
  faIcon?: boolean;
  subMenus: SubMenu[];
}

export interface SideBarData {
  tittle: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: MenuItem[];
}
