import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ComprasService } from 'src/app/shared/services/logistica/compra/compras.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Compra } from 'src/app/shared/interfaces/logistica';
import { ProveedoresService } from 'src/app/shared/services/logistica/proveedor/proveedores.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-compras-index',
  templateUrl: './compras-index.component.html',
  styleUrls: ['./compras-index.component.scss'],
})
export class ComprasIndexComponent implements OnInit {
  public ruta = rutas;

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public comprasService: ComprasService,
    public proveedoresService: ProveedoresService,
    private sucursalService: SucursalService
  ) {}

  public comprasList: Array<Compra> = [];
  dataSource!: MatTableDataSource<Compra>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(this.fechaActual, 'MM/dd/yyyy');

  ngOnInit(): void {
    this.fechaVisual = this.fechaFormateada;
    this.proveedoresAll();
    this.sucursalesAll();
  }

  datosPROVEEDOR: any;
  proveedoresAll(): void {
    this.proveedoresService.getProveedoresAll().subscribe({
      next: (datosPROVEEDOR: any) => {
        this.datosPROVEEDOR = datosPROVEEDOR;

        // Obtener la fecha seleccionada del formulario
        const fechaSeleccionadaInicio = this.form.value.fechacomprainicio;
        const fechaSeleccionadaFin = this.form.value.fechacomprafin;
        console.log(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        // Asegurarse de que fechaSeleccionada no sea null ni undefined antes de llamar a sucursalesAll
        if (
          fechaSeleccionadaInicio !== null &&
          fechaSeleccionadaInicio !== undefined &&
          fechaSeleccionadaFin !== null &&
          fechaSeleccionadaFin !== undefined
        ) {
          console.log(fechaSeleccionadaInicio, fechaSeleccionadaFin);
          this.comprasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosSUC: any;
  sucursalesAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (responseSUC: any) => {
        this.datosSUC = responseSUC;
      },
      error: () => {},
      complete: () => {},
    });
  }

  form = this.fb.group({
    fechacomprainicio: ['', Validators.required],
    fechacomprafin: ['', Validators.required],
  });

  fechaVisual: any;
  fechaVisualInicio: any;
  fechaVisualFin: any;
  fechaI: any;
  fechaF: any;
  resultadoMostrar: any;
  datosCOMPRA: Compra[] = [];
  private comprasAll(fechaInicio: string, fechaFin: string): void {
    this.comprasList = [];
    this.serialNumberArray = [];

    this.fechaVisualInicio = this.datePipe.transform(fechaInicio, 'dd/MM/yyyy');
    this.fechaVisualFin = this.datePipe.transform(fechaFin, 'dd/MM/yyyy');
    this.fechaI = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd');
    this.fechaF = this.datePipe.transform(fechaFin, 'yyyy-MM-dd');
    // Obtener datos sin aplicar el filtro
    this.comprasService.getComprasAll().subscribe({
      next: (datosCOMPRA: any) => {
        this.datosCOMPRA = datosCOMPRA;

        if (fechaInicio && fechaFin) {
          this.resultadoMostrar = true;
          //console.log(this.resultadoMostrar);
        }
        const dataCompraFinal = this.datosCOMPRA.filter(
          (comp: any) =>
            comp.compra_fecha >= this.fechaI && comp.compra_fecha <= this.fechaF
        );
        if (dataCompraFinal) {
          this.datosCOMPRA = dataCompraFinal;
          this.totalData = this.datosCOMPRA.length;
        }

        // Mapea los nombres de datos de ventas
        this.datosCOMPRA = this.datosCOMPRA.map((compra: Compra) => {
          //PARA PROVEEDOR
          const proveedor = this.datosPROVEEDOR.find(
            (prov: any) => prov.proveedor_id === compra.proveedor_id
          );
          if (proveedor) {
            compra.nombreProveedor = proveedor.razon_social;
          }
          //PARA DESTINO/SUCURSAL
          const sucursal = this.datosSUC.find(
            (suc: any) => suc.suc_id === compra.destino_id
          );
          if (sucursal) {
            compra.nombreSucursalDestino = sucursal.suc_nombre;
          }

          return compra;
        });

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosCOMPRA.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Compra>(this.comprasList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosCOMPRA.map((res: Compra, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.comprasList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: string): void {
    //this.dataSource.filter = value.trim().toLowerCase();
    //this.comprasList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCOMPRA)
    const filteredData = this.datosCOMPRA.filter((compra: Compra) => {
      return (
        (compra.compra_id &&
          compra.compra_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (compra.nombreProveedor &&
          compra.nombreProveedor.toLowerCase().includes(value.toLowerCase())) ||
        (compra.compra_fecha &&
          compra.compra_fecha
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (compra.tipo_pago &&
          compra.tipo_pago.toLowerCase().includes(value.toLowerCase())) ||
        (compra.proceso &&
          compra.proceso.toLowerCase().includes(value.toLowerCase())) ||
        (compra.nombreSucursalDestino &&
          compra.nombreSucursalDestino
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        ((compra.estado === 1 ? 'activo' : 'inactivo') &&
          (compra.estado === 1 ? 'activo' : 'inactivo')
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.comprasList
    this.comprasList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosCOMPRA.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Compra>(this.comprasList);
  }

  public sortData(sort: Sort) {
    const data = this.comprasList.slice();

    if (!sort.active || sort.direction === '') {
      this.comprasList = data;
    } else {
      this.comprasList = data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
    }
    //this.comprasAll();
    const fechaSeleccionadaInicio = this.form.value.fechacomprainicio;
    const fechaSeleccionadaFin = this.form.value.fechacomprafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.comprasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
    this.dataSource = new MatTableDataSource<Compra>(this.comprasList); // Agregar esta línea
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    //
    const fechaSeleccionadaInicio = this.form.value.fechacomprainicio;
    const fechaSeleccionadaFin = this.form.value.fechacomprafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.comprasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    //
    const fechaSeleccionadaInicio = this.form.value.fechacomprainicio;
    const fechaSeleccionadaFin = this.form.value.fechacomprafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.comprasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    //this.totalPages = Math.ceil(totalData / pageSize);
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  public recargarCompras(): void {
    const fechaInicio = this.datePipe.transform(
      this.form.value.fechacomprainicio,
      'yyyy-MM-dd'
    );
    const fechaFin = this.datePipe.transform(
      this.form.value.fechacomprafin,
      'yyyy-MM-dd'
    );

    if (
      fechaInicio !== null &&
      fechaInicio !== undefined &&
      fechaFin !== null &&
      fechaFin !== undefined
    ) {
      // Realizar la lógica de filtrado según el rango de fechas (fechaInicio y fechaFin)
      this.comprasAll(fechaInicio, fechaFin);
    }
  }

  verFecha() {
    const fechaInicio = this.datePipe.transform(
      this.form.value.fechacomprainicio,
      'yyyy-MM-dd'
    );
    const fechaFin = this.datePipe.transform(
      this.form.value.fechacomprafin,
      'yyyy-MM-dd'
    );

    if (
      fechaInicio !== null &&
      fechaInicio !== undefined &&
      fechaFin !== null &&
      fechaFin !== undefined
    ) {
      // Realizar la lógica de filtrado según el rango de fechas (fechaInicio y fechaFin)
      this.comprasAll(fechaInicio, fechaFin);
    }
  }
}
