import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { pageSelection, Movimientos } from 'src/app/shared/interfaces/almacen';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MovimientosAlmacenService } from '../../../../shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movimientos-almacen-index',
  templateUrl: './movimientos-almacen-index.component.html',
  styleUrls: ['./movimientos-almacen-index.component.scss'],
})
export class MovimientosAlmacenIndexComponent implements OnInit {
  public ruta = rutas;

  datosINGRESO: Movimientos[] = [];

  public ingresoList: Array<Movimientos> = [];
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
    public movimientosAlmacenService: MovimientosAlmacenService,
    public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.userAll();
  }

  fechaVisualInicio: any;
  fechaVisualFin: any;
  datosUSUARIOS: any;
  userAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSUARIOS: any) => {
        this.datosUSUARIOS = datosUSUARIOS;
        // Obtener la fecha seleccionada del formulario
        const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
        const fechaSeleccionadaFin = this.form.value.fechaventafin;
        // Asegurarse de que fechaSeleccionada no sea null ni undefined antes de llamar a sucursalesAll
        if (
          fechaSeleccionadaInicio !== null &&
          fechaSeleccionadaInicio !== undefined &&
          fechaSeleccionadaFin !== null &&
          fechaSeleccionadaFin !== undefined
        ) {
          this.ingresosAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        }
      },
      error: () => {},
      complete: () => {},
    });
  }
  public mostrarResultados: boolean = false;

  form = this.fb.group({
    fechaventainicio: ['', Validators.required],
    fechaventafin: ['', Validators.required],
  });
  datosINGRESOS: any;
  private ingresosAll(fechaInicio: string, fechaFin: string): void {
    this.ingresoList = [];
    this.serialNumberArray = [];

    // Verificar si se han ingresado fechas para filtrar
    this.fechaVisualInicio = this.datePipe.transform(fechaInicio, 'dd/MM/yyyy');
    this.fechaVisualFin = this.datePipe.transform(fechaFin, 'dd/MM/yyyy');
    console.log(fechaInicio, fechaFin);
    console.log(this.fechaVisualInicio, this.fechaVisualFin);
    // Mostrar resultados solo si se han ingresado fechas

    this.movimientosAlmacenService.getMovimientosAll().subscribe({
      next: (datosINGRESO: any) => {
        this.datosINGRESO = datosINGRESO;
        
        const fechaInicioE = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd');
        const fechaFinE = this.datePipe.transform(fechaFin, 'yyyy-MM-dd');

        // Concatenar la hora al final de las fechas
        const fechaInicioConHora = fechaInicioE + ' 00:00:00';
        const fechaFinConHora = fechaFinE + ' 23:59:59';
        this.datosINGRESOS = this.datosINGRESO.filter(
          (vent: any) =>
            vent.movimiento_fecha >= fechaInicioConHora &&
            vent.movimiento_fecha <= fechaFinConHora
        );
        this.datosINGRESO = this.datosINGRESOS;
        if (this.datosINGRESOS === 'no hay resultados') {
          this.totalData = 0;
        } else {
          this.totalData = this.datosINGRESOS.length;
        }

        // Mapea los nombres de datos de ventas
        this.datosINGRESO = this.datosINGRESO.map((movimiento: Movimientos) => {
          //PARA PROVEEDOR
          const usuario = this.datosUSUARIOS.find(
            (user: any) => user.user_id === movimiento.usuario_id
          );
          if (usuario) {
            movimiento.nombreUsuario = usuario.user_name;
          }

          return movimiento;
        });

        this.datosINGRESO.map((res: Movimientos, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.ingresoList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
        console.log(this.datosINGRESO);
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Movimientos>(this.ingresoList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }
  public searchData(value: string): void {
    console.log('searchDataValue:', value);
    this.dataSource.filter = value.trim().toLowerCase();
    this.ingresoList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.ingresoList.slice();

    if (!sort.active || sort.direction === '') {
      this.ingresoList = data;
    } else {
      this.ingresoList = data.sort((a, b) => {
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
      this.form.value.fechaventainicio,
      'yyyy-MM-dd'
    );
    const fechaFin = this.datePipe.transform(
      this.form.value.fechaventafin,
      'yyyy-MM-dd'
    );
    console.log(fechaInicio);
    console.log(fechaFin);

    // Concatenar la hora al final de las fechas
    const fechaInicioConHora = fechaInicio + ' 00:00:00';
    const fechaFinConHora = fechaFin + ' 23:59:59';

    /* // Convertir las cadenas de fecha a objetos Date
    const fechaInicioDate = new Date(fechaInicioConHora);
    const fechaFinDate = new Date(fechaFinConHora);

    console.log(fechaInicioDate);
    console.log(fechaFinDate);

    // Filtrar utilizando getTime() para comparar milisegundos
    this.stockLista = this.ingresoList.filter((data) => {
      const movimientoFecha = new Date(data.movimiento_fecha);
      return (
        movimientoFecha.getTime() >= fechaInicioDate.getTime() &&
        movimientoFecha.getTime() <= fechaFinDate.getTime()
      );
    }); */

    if (
      fechaInicio !== null &&
      fechaInicio !== undefined &&
      fechaFin !== null &&
      fechaFin !== undefined
    ) {
      // Realizar la lógica de filtrado según el rango de fechas (fechaInicio y fechaFin)
      this.ingresosAll(fechaInicio, fechaFin);
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
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.ingresosAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
    this.dataSource = new MatTableDataSource<Movimientos>(this.ingresoList); // Agregar esta línea
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
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.ingresosAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.ingresosAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
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

  public actualizarIngresos(): void {
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.ingresosAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }
}
