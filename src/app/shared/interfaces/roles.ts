export interface pageSelection {
  skip: number;
  limit: number;
}

export interface Roles {
  rol_id: number;
  rol_nombre: string;
  rol_descripcion: string;
  rol_estado?: string | null;
}
