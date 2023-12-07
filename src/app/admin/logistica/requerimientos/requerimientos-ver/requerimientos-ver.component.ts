import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';

import { GeneralService } from 'src/app/shared/services/general.service';
import { GenerarRequerimientoService } from 'src/app/shared/services/almacen/generar-requerimiento/generar-requerimiento.service';

import { GenerarRequerimientoItemService } from 'src/app/shared/services/almacen/generar-requerimiento/generar-requerimiento-item.service';
import { DatePipe } from '@angular/common';

import { Requerimiento_Detalle } from 'src/app/shared/interfaces/almacen';

import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-requerimientos-ver',
  templateUrl: './requerimientos-ver.component.html',
  styleUrls: ['./requerimientos-ver.component.scss'],
})
export class RequerimientosVerComponent implements OnInit {
  public ruta = rutas;
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private productoService: ProductoService,
    private medidaService: MedidaService,
    private generalService: GeneralService,
    private generarRequerimientoService: GenerarRequerimientoService,
    private generarRequerimientoItemService: GenerarRequerimientoItemService,
    private datePipe: DatePipe
  ) {}

  public pageSize = 10;
  public currentPage = 1;

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  requerimientoId: number | null = null;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const requerimientoIdParam = params.get('requerimiento_id');
      if (requerimientoIdParam !== null) {
        this.requerimientoId = +requerimientoIdParam;
      }
    });

    const initialForm = this.fb.group({
      requerimientoDetalle: this.fb.group({
        idsucursal_origen: ['', Validators.required],
        sucursal_origen: ['', Validators.required],
        user_nombre: ['', Validators.required],
        fecha: ['', Validators.required],
      }),

      listaRequerimiento: this.fb.array([]), // FormArray para la lista de compra
    });

    // Asignar el formulario
    this.form = initialForm;

    this.medidasAll();
    this.sucursalAll();
    this.usuariosAll();
    this.productosAll();
  }

  datosPRO: any;
  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.requerimientoDetalleItem(this.requerimientoId);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosUSER: any;
  usuariosAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSER: any) => {
        this.datosUSER = datosUSER;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosMED: any;
  medidasAll(): void {
    this.medidaService.getMedidasAll().subscribe({
      next: (datosMED: any) => {
        this.datosMED = datosMED;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosSUC: any;
  sucursalAll() {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;
        this.requerimientoDetalle(this.requerimientoId);
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datoREQUERIMIENTO: any = {};
  requerimientoDetalle(requerimientoId: any) {
    this.generarRequerimientoService
      .getRequerimiento(requerimientoId)
      .subscribe({
        next: (data) => {
          this.datoREQUERIMIENTO = data;

          const usuario = this.datosUSER.find(
            (user: any) =>
              user.user_id === this.datoREQUERIMIENTO[0]['usuario_id']
          );
          if (usuario) {
            this.form
              .get('requerimientoDetalle.user_nombre')
              ?.setValue(usuario.user_nombre);
          }
          const fechaformateada = this.datePipe.transform(
            this.datoREQUERIMIENTO[0]['requerimiento_fecha'],
            'dd/MM/yyyy'
          );

          const sucursal = this.datosSUC.find(
            (suc: any) =>
              suc.suc_id === this.datoREQUERIMIENTO[0]['sucursal_id']
          );
          if (sucursal) {
            this.form
              .get('requerimientoDetalle.sucursal_origen')
              ?.setValue(sucursal.suc_nombre);
            this.form
              .get('requerimientoDetalle.idsucursal_origen')
              ?.setValue(sucursal.suc_id);
          }
          //ASIGNAMOS DE FORMA INDEPENDIENTE EL RESULTADO DE LA FECHA OBTENIDA
          this.form
            .get('requerimientoDetalle.fecha')
            ?.setValue(fechaformateada);
        },
        error: (errorData) => {
          console.error('Error al obtener los datos de la venta: ', errorData);
        },
        complete: () => {},
      });
  }

  datosProductosDetalle: any;
  datosREQUERIMIENTODetalle: any;
  requerimientoDetalleItem(requerimientoId: any) {
    this.generarRequerimientoItemService
      .getRequerimientosItem(requerimientoId)
      .subscribe({
        next: (response) => {
          //console.log(response)
          this.datosProductosDetalle = response;
          // Mapea los nombres de los clientes a los datos de ventas
          this.datosProductosDetalle = this.datosProductosDetalle.map(
            (requerimientoDetalle: Requerimiento_Detalle) => {
              console.log(requerimientoDetalle);
              //PARA PRODUCTOS
              const producto = this.datosPRO.find(
                (pro: any) => pro.prod_id === requerimientoDetalle.producto_id
              );
              if (producto) {
                requerimientoDetalle.nombreProducto = producto.prod_nombre;
                requerimientoDetalle.codigoProducto = producto.prod_codigo;
              }
              return requerimientoDetalle;
            }
          );
          this.datosREQUERIMIENTODetalle = this.datosProductosDetalle;
        },
        error: (errorData) => {
          console.error(
            'Error al enviar la solicitud GET de VentaDetalleItems:',
            errorData
          );
        },
        complete: () => {},
      });
  }

  //EXPORTAR A EXCEL
  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Estilo para los encabezados
    const headerStyle = {
      font: { bold: true, size: 12 },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A1C1E7' }, // Color de fondo Malibu
      } as ExcelJS.Fill,
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega encabezados con estilo y asigna anchos
    const headers0 = [
      { header: 'USUARIO', key: 'usuario', width: 20 },
      { header: 'FECHA', key: 'fecha', width: 25 },
      { header: 'SUCURSAL', key: 'sucursal', width: 60 },
    ];

    // Ajusta la altura de la fila de encabezados
    const headerRow0 = worksheet.addRow(
      headers0.map((header) => header.header)
    );
    headerRow0.height = 30; // Altura del header

    headerRow0.eachCell((cell, colNumber) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;

      // Configura el ancho de la columna
      worksheet.getColumn(colNumber).width = headers0[colNumber - 1].width;

      // Centra el texto en la celda
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Configura bordes para la fila de encabezados
    headerRow0.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega datos de PRODUCTOS
    const requerimientoDetalleValue = this.form.get(
      'requerimientoDetalle'
    )?.value;

    if (requerimientoDetalleValue) {
      const row = [
        requerimientoDetalleValue.user_nombre,
        requerimientoDetalleValue.fecha,
        requerimientoDetalleValue.sucursal_origen,
      ];

      const excelRow = worksheet.addRow(row);
      excelRow.height = 20; // Altura del header

      // Configura bordes para las celdas en la fila de datos
      excelRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Centra las celdas específicas en la fila de datos
      excelRow.getCell(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // USUARIO
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // FECHA
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // SUCURSAL
    } else {
      console.error('requerimientoDetalle no esta definido o es nulo');
    }

    //////////////////////////////////////////////////////////
    const emptyRow = worksheet.addRow([]);
    //////////////////////////////////////////////////////////////

    // Agrega encabezados con estilo y asigna anchos
    const headers1 = [
      { header: '#', key: '#', width: 20 },
      { header: 'Codigo', key: 'codigo', width: 25 },
      { header: 'Producto', key: 'producto', width: 60 },
      { header: 'Cantidad', key: 'cantidad', width: 20 },
    ];

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Ajusta la altura de la fila de encabezados
    const headerRow1 = worksheet.addRow(
      headers1.map((header) => header.header)
    );
    headerRow1.height = 25; // Altura del header

    headerRow1.eachCell((cell, colNumber) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;

      // Configura el ancho de la columna
      worksheet.getColumn(colNumber).width = headers1[colNumber - 1].width;

      // Centra el texto en la celda
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Configura bordes para la fila de encabezados
    headerRow1.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega datos de PRODUCTOS
    this.datosREQUERIMIENTODetalle.forEach((data: any) => {
      const row = [
        (this.currentPage - 1) * this.pageSize +
          this.datosREQUERIMIENTODetalle.indexOf(data) +
          1,
        data.codigoProducto,
        data.nombreProducto,
        data.requerimiento_cantidad,
      ];

      const excelRow = worksheet.addRow(row);
      excelRow.height = 20; // Altura del header

      // Configura bordes para las celdas en la fila de datos
      excelRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Centra las celdas específicas en la fila de datos
      excelRow.getCell(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // #
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
      }; // CODIGO
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
      }; // NOMBREPRODUCTO
      const montoCell = excelRow.getCell(4);
      montoCell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // CANTIDAD
      montoCell.numFmt = '#,##0.00'; // Formato de número con 2 decimales
    });

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Requerimientos N° ' +
        this.requerimientoId +
        ' ' +
        this.fechaFormateada +
        '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
