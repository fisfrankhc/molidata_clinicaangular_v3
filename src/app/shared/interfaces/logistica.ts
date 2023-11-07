export interface pageSelection {
  skip: number;
  limit: number;
}

export interface Categoria {
  cat_id: number;
  cat_nombre: string;
  cat_descripcion: string;
  cat_estado?: string | null;
}

export interface Producto {
  prod_id: number;
  prod_codigo: string;
  prod_nombre: string;
  prod_descripcion: string;
  precio_venta: number;
  med_id: number;
  imagen_nombre: string;
  cat_id: number;
  nombreCategoria: string; //PARA VISTA
}

export interface Medida {
  med_id: number;
  med_nombre: string;
  med_simbolo: string;
}