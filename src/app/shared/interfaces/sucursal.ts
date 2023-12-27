export interface pageSelection {
  skip: number;
  limit: number;
}

export interface Sucursal {
  suc_id: number;
  suc_nombre: string;
  suc_direccion: string;
  suc_estado?: string | null;
}
