export interface pageSelection {
  skip: number;
  limit: number;
}

export interface User {
  fecha_registro: string;
  rol_id: number;
  sucursal_id: number;
  user_clave: string;
  user_correo: string;
  user_estado: number;
  user_id: number;
  user_name: string;
  user_nombre: string;
  user_telefono: string;
  user_panel: string;
  nombreRol: string; //PARA VISTA
}
