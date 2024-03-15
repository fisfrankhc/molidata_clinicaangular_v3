import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { pageSelection, Movimientos } from 'src/app/shared/interfaces/almacen';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as Notiflix from 'notiflix';

@Component({
  selector: 'app-transferencias-index',
  templateUrl: './transferencias-index.component.html',
  styleUrls: ['./transferencias-index.component.scss'],
})
export class TransferenciasIndexComponent implements OnInit {
  public ruta = rutas;

  datosTRANSFERENCIA: Movimientos[] = [];
  usersucursal: any = localStorage.getItem('usersucursal');

  public trasnferenciasList: Array<Movimientos> = [];
  dataSource!: MatTableDataSource<Movimientos>;

  public showFilter = false;
  public searchDataValue: string = '';
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

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    //public movimientosCentralService: MovimientosCentralService,
    private movimientosAlmacenService: MovimientosAlmacenService,
    public generalService: GeneralService,
    private sucursalService: SucursalService
  ) {}

  ngOnInit(): void {
    this.userAll();
    this.sucursalesAll();
  }

  datosSUCURSALES: any;
  sucursalesAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUCURSALES = datosSUC;
      },
      error: () => {},
      complete: () => {},
    });
  }

  fechaVisualInicio: any;
  fechaVisualFin: any;
  datosUSUARIOS: any;
  userAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSUARIOS: any) => {
        this.datosUSUARIOS = datosUSUARIOS;
        // Obtener la fecha seleccionada del formulario
        const fechaSeleccionadaInicio = this.form.value.fechabusquedainicio;
        const fechaSeleccionadaFin = this.form.value.fechabusquedafin;
        // Asegurarse de que fechaSeleccionada no sea null ni undefined antes de llamar a sucursalesAll
        if (
          fechaSeleccionadaInicio !== null &&
          fechaSeleccionadaInicio !== undefined &&
          fechaSeleccionadaFin !== null &&
          fechaSeleccionadaFin !== undefined
        ) {
          this.transferenciasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
          Notiflix.Loading.remove();
        }
      },
      error: () => {},
      complete: () => {},
    });
  }
  public mostrarResultados: boolean = false;

  form = this.fb.group({
    fechabusquedainicio: ['', Validators.required],
    fechabusquedafin: ['', Validators.required],
  });
  datosTRANSFERENCIAS: any;
  private transferenciasAll(fechaInicio: string, fechaFin: string): void {
    //Notiflix.Loading.circle('Obteniendo datos...');
    Notiflix.Loading.standard('Loading...', {
      backgroundColor: 'rgba(0,0,255,0.1)',
    });
    this.trasnferenciasList = [];
    this.serialNumberArray = [];

    // Verificar si se han ingresado fechas para filtrar
    this.fechaVisualInicio = this.datePipe.transform(fechaInicio, 'dd/MM/yyyy');
    this.fechaVisualFin = this.datePipe.transform(fechaFin, 'dd/MM/yyyy');
    //console.log(fechaInicio, fechaFin);
    //console.log(this.fechaVisualInicio, this.fechaVisualFin);
    // Mostrar resultados solo si se han ingresado fechas

    this.movimientosAlmacenService.getMovimientosAll().subscribe({
      next: (datosTRANSFERENCIA: any) => {
        this.datosTRANSFERENCIA = datosTRANSFERENCIA;

        const fechaInicioE = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd');
        const fechaFinE = this.datePipe.transform(fechaFin, 'yyyy-MM-dd');

        // Concatenar la hora al final de las fechas
        const fechaInicioConHora = fechaInicioE + ' 00:00:00';
        const fechaFinConHora = fechaFinE + ' 23:59:59';
        this.datosTRANSFERENCIAS = this.datosTRANSFERENCIA.filter(
          (trans: any) =>
            trans.movimiento_fecha >= fechaInicioConHora &&
            trans.movimiento_fecha <= fechaFinConHora &&
            trans.movimiento_origen == 'TRANSFERENCIA' &&
            trans.movimiento_observaciones == '' &&
            trans.sucursal_id === this.usersucursal
        );
        Notiflix.Loading.remove();
        //console.log(this.datosTRANSFERENCIAS);
        this.datosTRANSFERENCIA = this.datosTRANSFERENCIAS;
        if (this.datosTRANSFERENCIAS === 'no hay resultados') {
          this.totalData = 0;
        } else {
          this.totalData = this.datosTRANSFERENCIAS.length;
        }

        // Mapea los nombres de datos de ventas
        this.datosTRANSFERENCIA = this.datosTRANSFERENCIA.map(
          (movimiento: Movimientos) => {
            //PARA PROVEEDOR
            const usuario = this.datosUSUARIOS.find(
              (user: any) => user.user_id === movimiento.usuario_id
            );
            if (usuario) {
              movimiento.nombreUsuario = usuario.user_name;
            }
            //PARA SUCURSAL
            const sucursal = this.datosSUCURSALES.find(
              (suc: any) => suc.suc_id === movimiento.sucursal_id
            );
            if (sucursal) {
              movimiento.nombreSucursal = sucursal.suc_nombre;
            }

            return movimiento;
          }
        );

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosTRANSFERENCIA.length;
        }
        //console.log(this.datosTRANSFERENCIA);
      },
      error: (errorData) => {
        Notiflix.Loading.remove();
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Movimientos>(
          this.trasnferenciasList
        );
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosTRANSFERENCIA.map((res: Movimientos, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.trasnferenciasList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: string): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.trasnferenciasList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosTRANSFERENCIA)
    const filteredData = this.datosTRANSFERENCIA.filter(
      (movimiento: Movimientos) => {
        return (
          (movimiento.movimiento_id &&
            movimiento.movimiento_id
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (movimiento.movimiento_fecha &&
            movimiento.movimiento_fecha
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (movimiento.nombreUsuario &&
            movimiento.nombreUsuario
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (movimiento.movimiento_tipo &&
            movimiento.movimiento_tipo
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (movimiento.nombreSucursal &&
            movimiento.nombreSucursal
              .toLowerCase()
              .includes(value.toLowerCase()))
        );
      }
    );

    // Asigna los datos filtrados a this.trasnferenciasList
    this.trasnferenciasList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosTRANSFERENCIA.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Movimientos>(
      this.trasnferenciasList
    );
  }

  public sortData(sort: Sort) {
    const data = this.trasnferenciasList.slice();

    if (!sort.active || sort.direction === '') {
      this.trasnferenciasList = data;
    } else {
      this.trasnferenciasList = data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
  stockLista: any;
  verFecha() {
    const fechaInicio = this.datePipe.transform(
      this.form.value.fechabusquedainicio,
      'yyyy-MM-dd'
    );
    const fechaFin = this.datePipe.transform(
      this.form.value.fechabusquedafin,
      'yyyy-MM-dd'
    );
    console.log(fechaInicio);
    console.log(fechaFin);

    // Concatenar la hora al final de las fechas
    const fechaInicioConHora = fechaInicio + ' 00:00:00';
    const fechaFinConHora = fechaFin + ' 23:59:59';

    if (
      fechaInicio !== null &&
      fechaInicio !== undefined &&
      fechaFin !== null &&
      fechaFin !== undefined
    ) {
      // Realizar la lógica de filtrado según el rango de fechas (fechaInicio y fechaFin)
      this.transferenciasAll(fechaInicio, fechaFin);
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
    const fechaSeleccionadaInicio = this.form.value.fechabusquedainicio;
    const fechaSeleccionadaFin = this.form.value.fechabusquedafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.transferenciasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
    this.dataSource = new MatTableDataSource<Movimientos>(
      this.trasnferenciasList
    ); // Agregar esta línea
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
    const fechaSeleccionadaInicio = this.form.value.fechabusquedainicio;
    const fechaSeleccionadaFin = this.form.value.fechabusquedafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.transferenciasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    const fechaSeleccionadaInicio = this.form.value.fechabusquedainicio;
    const fechaSeleccionadaFin = this.form.value.fechabusquedafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.transferenciasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  public actualizarTransferencias(): void {
    const fechaSeleccionadaInicio = this.form.value.fechabusquedainicio;
    const fechaSeleccionadaFin = this.form.value.fechabusquedafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.transferenciasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }
}
