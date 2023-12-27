import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { VentasConfirmadasService } from 'src/app/shared/services/farmacia/ventas/ventas-confirmadas.service';
import { Sort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Ventas } from 'src/app/shared/interfaces/farmacia';
import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { InicioCierreOperacionesService } from 'src/app/shared/services/farmacia/inicio-cierre-operaciones/inicio-cierre-operaciones.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-caja-index',
  templateUrl: './caja-index.component.html',
  styleUrls: ['./caja-index.component.scss'],
})
export class CajaIndexComponent implements OnInit {
  public ruta = rutas;
  datosVENTA: Ventas[] = [];

  userid = localStorage.getItem('userid');
  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(this.fechaActual, 'yyyy/MM/dd');
  fechaFormateadaVTabla = this.datePipe.transform(
    this.fechaActual,
    'yyyy-MM-dd'
  );

  constructor(
    private router: Router,
    public ventasConfirmadasService: VentasConfirmadasService,
    public clientesService: ClientesService,
    public sucursalService: SucursalService,
    private inicioCierreOperacionesService: InicioCierreOperacionesService,
    private datePipe: DatePipe
  ) {}

  public ventasList: Array<Ventas> = [];
  dataSource!: MatTableDataSource<Ventas>;

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

  datosICOperaciones: any;
  ICOperacionesEncontrado1: any;
  ICOperacionesEncontrado2: any;
  ngOnInit(): void {
    this.inicioCierreOperacionesService
      .getInicioCierreOperacionesAll()
      .subscribe({
        next: (data) => {
          this.datosICOperaciones = data;

          //VALIDACION 1
          this.ICOperacionesEncontrado1 = this.datosICOperaciones.find(
            (ICO: any) =>
              ICO.user_id === this.userid &&
              ICO.sesion_tipo == 'APERTURA' &&
              ICO.sesion_fecha == this.fechaFormateadaVTabla
          ); //this.fechaFormateadaVTabla, '2023-12-05'
          if (this.ICOperacionesEncontrado1) {
            //console.log('TODO NORMAL');

            //VALIDACION 2
            this.ICOperacionesEncontrado2 = this.datosICOperaciones.find(
              (ICO: any) =>
                ICO.user_id === this.userid &&
                ICO.sesion_tipo == 'CIERRE' &&
                ICO.sesion_fecha == this.fechaFormateadaVTabla
            ); //this.fechaFormateadaVTabla, '2023-12-05'
            if (this.ICOperacionesEncontrado2) {
              //console.log('YA HIZO EL CIERRE');
              Swal.fire({
                icon: 'info',
                title: 'ya ha realizado el cierre de caja',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
              }).then(() => {
                this.router.navigate(['/farmacia/inicio-cierre-operaciones']);
              });
            } else {
              console.log('AUN NO HA REALIZADO EL CIERRE, TODO BIEN');
              this.clientesAll();
              this.sucursalAll();
            }
            //TERMINA VALIDACION 2
          } else {
            //alert("NO SE ENCONTRARON DATOS")
            Swal.fire({
              icon: 'error',
              title: 'No ha realizado la apertura de caja',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            }).then(() => {
              this.router.navigate(['/farmacia/inicio-cierre-operaciones']);
            });
          }
        },
        error: (errorData) => {},
        complete: () => {},
      });
  }

  datosCLI: any;
  clientesAll(): void {
    this.clientesService.getClientesAll().subscribe({
      next: (datosCLI: any) => {
        this.datosCLI = datosCLI;
        this.ventasConfirmadasAll();
      },
      error: () => {},
      complete: () => {},
    });
  }
  datosSUC: any;
  sucursalAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;
      },
      error: () => {},
      complete: () => {},
    });
  }

  ventasConfirmadasAll(): void {
    this.ventasList = [];
    this.serialNumberArray = [];

    this.ventasConfirmadasService.getVentaConfirmada(1).subscribe({
      next: (datosVENTA: any) => {
        this.datosVENTA = datosVENTA;
        this.totalData = this.datosVENTA.length;

        // Mapea los nombres de los clientes a los datos de ventas
        this.datosVENTA = this.datosVENTA.map((venta: Ventas) => {
          //PARA CLIENTES
          const cliente = this.datosCLI.find(
            (cli: any) => cli.cli_id === venta.cliente_id
          );
          if (cliente) {
            venta.nombreCliente = cliente.cli_nombre;
          }
          //PARA SUCURSALES
          const sucursal = this.datosSUC.find(
            (suc: any) => suc.suc_id === venta.sucursal_id
          );
          if (sucursal) {
            venta.nombreSucursal = sucursal.suc_nombre;
          }
          return venta;
        });

        this.datosVENTA.map((res: Ventas, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.ventasList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Ventas>(this.ventasList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.ventasList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.ventasList.slice();

    if (!sort.active || sort.direction === '') {
      this.ventasList = data;
    } else {
      this.ventasList = data.sort((a, b) => {
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
      this.ventasConfirmadasAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.ventasConfirmadasAll();
    }
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
    this.ventasConfirmadasAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.ventasConfirmadasAll();
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
}
