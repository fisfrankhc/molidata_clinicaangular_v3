import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { VentasService } from 'src/app/shared/services/farmacia/ventas/ventas.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Ventas } from 'src/app/shared/interfaces/farmacia';
import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
  selector: 'app-ventas-index',
  templateUrl: './ventas-index.component.html',
  styleUrls: ['./ventas-index.component.scss'],
})
export class VentasIndexComponent implements OnInit {
  public ruta = rutas;
  datosVENTA: Ventas[] = [];

  constructor(
    public ventasService: VentasService,
    public clientesService: ClientesService,
    public sucursalService: SucursalService,
    public generalService: GeneralService
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

  ngOnInit(): void {
    this.clientesAll();
    this.sucursalAll();
    this.usuariosAll();
  }

  datosUSER: any;
  usuariosAll(): void{
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSER: any) => {
        this.datosUSER = datosUSER;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosCLI: any;
  clientesAll(): void {
    this.clientesService.getClientesAll().subscribe({
      next: (datosCLI: any) => {
        this.datosCLI = datosCLI;
        this.ventasAll();
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

  private ventasAll(): void {
    this.ventasList = [];
    this.serialNumberArray = [];
    this.ventasService.getVentasAll().subscribe({
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

          //PARA SUCURSALES
          const usuario = this.datosUSER.find(
            (user: any) => user.user_id === venta.usuario_id
          );
          if (usuario) {
            venta.nombreUsuarioVenta = usuario.user_nombre;
          }

          /* this.generalService.getUsuario(venta.usuario_id).subscribe({
            next: (response) => {
              venta.nombreUsuarioVenta = response[0]?.user_nombre;
            },
            error: (errorData) => {},
            complete: () => {},
          }); */

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

  public searchData(value: string): void {
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
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
    }
    this.ventasAll();
    this.dataSource = new MatTableDataSource<Ventas>(this.ventasList); // Agregar esta línea
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
    this.ventasAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.ventasAll();
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
