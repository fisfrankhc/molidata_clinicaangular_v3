export interface pageSelection {
  skip: number;
  limit: number;
}

export interface Comprobantes {
  comprobante_id: number;
  comprobante_tipo: string;
  fecha_emision: string;
  empresa_emision: string;
  cliente_documento_tipo: string;
  cliente_documento_numero: string;
  cliente_razon_social: string;
  cliente_direccion: string;
  comprobante_serie: string;
  comprobante_numero: string;
  envio_sunat: string;
  respuesta_sunat: string;
  estado_comprobante: string;
  codigo_observacion: string;
  motivo_observacion: string;
  nota_tipo: string;
  nota_serie: string;
  nota_numero: string;
  cod_tipo_motivo: string;
  nota_desc_motivo: string;
  venta_id: number;
}

export interface ComprobantesDetalles {
  detalle_id: number;
  comprobante: number;
  producto_codigo: string;
  producto_nombre: string;
  precio_venta: string;
  cantidad_venta: string;
  gravado: string;
  exonerado: string;
  gratuitas: string;
  igv: string;
  isc: string;
  medida: string;
}

export interface ComprobanteNumeracion {
  numeracion_id: number;
  sede_id: number;
  comprobante_tipo: string;
  serie: string;
  numero: string;
  nombreSede: string; //PARA VISTA
  nombreComprobanteTipo: string; //PARA VISTA
}

export interface ComprobanteTipos {
  tipo_id: number;
  tipo_nombre: string;
  codigo_sunat: string;
}
