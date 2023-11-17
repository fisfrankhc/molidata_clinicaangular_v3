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
  nombreMedida: string; //PARA VISTA
}

export interface Medida {
  med_id: number;
  med_nombre: string;
  med_simbolo: string;
}

export interface Proveedor {
  proveedor_id: number;
  documento_tipo: string;
  documento_numero: string;
  razon_social: string;
  proveedor_direccion: string;
  proveedor_telefono: number;
  proveedor_email: string;
  proveedor_descripcion: string;
  representante_ventas: string;
  proveedor_estado: number;
}

export interface Compra {
  compra_id: number;
  proveedor_id: number;
  compra_fecha: Date;
  compra_moneda: string; //SOLES, DOLARES *
  empresa_id: number; //*
  tipo_pago: string; //CONTADO, CREDITO *
  usuario_id: number;
  proceso: string; //COTIZACION, CONFIRMADO,  RECEPCIONADO
  comprobante_tipo: string;
  comprobante_serie: string;
  comprobante_numero: string;
  destino_id: number; //sucursal a donde se va ingresar el stock
  estado: number;
  nombreProveedor: string; //PARA VISTA
}

export interface CompraDetalle {
  detalle_id: number;
  compra_id: number;
  producto_id: number;
  cantidad: number;
  unidad_medida: number;
  precio_compra: number;
  entrega: number;
  nombreProducto: string; //PARA VISTA
  codigoProducto: string; //PARA VISTA
  nombreMedida: string; //PARA VISTA
}
export interface Stock {
  stock_id: number;
  almacen_id: string;
  producto_id: number;
  cantidad: number;
  unidad_medida: number;
  codigoProducto: string; // PARA VISTA
  nombreProducto: string; //PARA VISTA
  nombreMedida: string; //PARA VISTA
}
