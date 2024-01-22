import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Operacion } from 'src/app/shared/interfaces/despacho';
import { rutas } from 'src/app/shared/routes/rutas';
import { OperacionService } from 'src/app/shared/services/despacho/caja/operacion.service';
import { Sort } from '@angular/material/sort';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reporte-caja-index',
  templateUrl: './reporte-caja-index.component.html',
  styleUrls: ['./reporte-caja-index.component.scss'],
})
export class ReporteCajaIndexComponent implements OnInit {
  public ruta = rutas;

  constructor(public operacionService: OperacionService) {}

  public operacionList: Array<Operacion> = [];
  dataSource!: MatTableDataSource<Operacion>;

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
    this.operacionAll();
  }

  datosOPER: Operacion[] = [];
  operacionAll(): void {
    this.operacionList = [];
    this.serialNumberArray = [];
    this.operacionService.getOperacionAll().subscribe({
      next: (datosOPER: any) => {
        this.datosOPER = datosOPER;
        //this.totalData = this.datosOPER.length;

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosOPER.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Operacion>(this.operacionList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosOPER.map((res: Operacion, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.operacionList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.operacionList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosOPER)
    const filteredData = this.datosOPER.filter((operacion: Operacion) => {
      return (
        (operacion.ope_id &&
          operacion.ope_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (operacion.user_id &&
          operacion.user_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (operacion.fecha_pago &&
          operacion.fecha_pago
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (operacion.ope_tipo &&
          operacion.ope_tipo.toLowerCase().includes(value.toLowerCase())) ||
        (operacion.monto_pago &&
          operacion.monto_pago
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (operacion.motivo_pago &&
          operacion.motivo_pago.toLowerCase().includes(value.toLowerCase())) ||
        (operacion.motivo_codigo &&
          operacion.motivo_codigo
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (operacion.medio_pago &&
          operacion.medio_pago.toLowerCase().includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.operacionsList
    this.operacionList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosOPER.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Operacion>(this.operacionList);
    // Actualiza pageNumberArray para reflejar la cantidad correcta de páginas (PUEDE SER)
    //this.pageNumberArray = Array.from({ length: this.totalPages },(_, i) => i + 1);
    //console.log(this.pageNumberArray);
  }

  public sortData(sort: Sort) {
    const data = this.operacionList.slice();

    if (!sort.active || sort.direction === '') {
      this.operacionList = data;
    } else {
      this.operacionList = data.sort((a, b) => {
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
      this.operacionAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.operacionAll();
    }
    // Recalcula las páginas después de actualizar los datos (PUEDE SER)
    //this.calculateTotalPages(this.totalFilteredData, this.pageSize);
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Operacion>(this.operacionList); // Agregar esta línea
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
    //console.log(this.pageIndex);
    this.operacionAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.operacionAll();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    //this.totalPages = Math.ceil(totalData / pageSize);
    //console.log(this.totalPages);
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; ++i) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  public exportarAExcel(): void {
    // Tu lista de datos (reemplaza esto con tus propios datos)
    const data = this.operacionList;

    // Crear un libro de trabajo y agregar una hoja de trabajo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet['A1'].v = 'ID de Operación';
    worksheet['B1'].v = 'Usuario Encargado';
    worksheet['C1'].v = 'Fecha de Pago';
    worksheet['D1'].v = 'Tipo de Operación';
    worksheet['E1'].v = 'Monto Pagado';
    worksheet['F1'].v = 'Motivo Pago';
    worksheet['G1'].v = 'ID Venta';
    worksheet['H1'].v = 'Descripción';
    worksheet['I1'].v = 'Forma de Pago';
    worksheet['J1'].v = 'Detalle';
    worksheet['K1'].v = 'Estado';

    // Agregar la hoja de trabajo al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Caja');

    // Crear un archivo Excel en formato base64
    const excelBase64 = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'base64',
    });

    // Convertir el archivo base64 en un Blob
    const excelBlob = this.base64ToBlob(
      excelBase64,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    // Crear un objeto URL para el Blob
    const excelUrl = URL.createObjectURL(excelBlob);

    // Crear un enlace de descarga
    const a = document.createElement('a');
    a.href = excelUrl;
    a.download = 'reporte_caja.xlsx'; // Nombre del archivo Excel
    a.click();

    // Liberar los recursos
    URL.revokeObjectURL(excelUrl);
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}
