import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ComprasService } from 'src/app/shared/services/logistica/compra/compras.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Compra } from 'src/app/shared/interfaces/logistica';
import { ProveedoresService } from 'src/app/shared/services/logistica/proveedor/proveedores.service';

@Component({
  selector: 'app-compras-index',
  templateUrl: './compras-index.component.html',
  styleUrls: ['./compras-index.component.scss'],
})
export class ComprasIndexComponent implements OnInit {
  public ruta = rutas;

  constructor(
    public comprasService: ComprasService,
    public proveedoresService: ProveedoresService
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

  ngOnInit(): void {
    this.proveedoresAll();
  }

  datosPROVEEDOR: any;
  proveedoresAll(): void {
    this.proveedoresService.getProveedoresAll().subscribe({
      next: (datosPROVEEDOR: any) => {
        this.datosPROVEEDOR = datosPROVEEDOR;
        this.comprasAll();
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosCOMPRA: Compra[] = [];
  private comprasAll(): void {
    this.comprasList = [];
    this.serialNumberArray = [];
    this.comprasService.getComprasAll().subscribe({
      next: (datosCOMPRA: any) => {
        this.datosCOMPRA = datosCOMPRA;
        this.totalData = this.datosCOMPRA.length;

        // Mapea los nombres de datos de ventas
        this.datosCOMPRA = this.datosCOMPRA.map((compra: Compra) => {
          //PARA PROVEEDOR
          const proveedor = this.datosPROVEEDOR.find(
            (prov: any) => prov.proveedor_id === compra.proveedor_id
          );
          if (proveedor) {
            compra.nombreProveedor = proveedor.razon_social;
          }

          return compra;
        });

        datosCOMPRA.map((res: Compra, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.comprasList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Compra>(this.comprasList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.comprasList = this.dataSource.filteredData;
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
    this.comprasAll();
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
    this.comprasAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.comprasAll();
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
