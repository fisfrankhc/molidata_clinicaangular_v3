import { Component, OnInit } from '@angular/core';
import { rutasclinica } from 'src/app/shared/routes/rutasclinica';
import {
  pageSelection,
  Pacientes,
} from 'src/app/shared/interfaces/clinica/cita';
import { PacientesService } from 'src/app/shared/services/clinica/cita/pacientes/pacientes.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-pacientes-index',
  templateUrl: './pacientes-index.component.html',
  styleUrls: ['./pacientes-index.component.scss'],
})
export class PacientesIndexComponent implements OnInit {
  public rutaclinica = rutasclinica;
  datosPACIENTES: Pacientes[] = [];
  clienteallError: string = '';

  public pacientesList: Array<Pacientes> = [];
  dataSource!: MatTableDataSource<Pacientes>;

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

  constructor(public pacientesService: PacientesService) {}

  ngOnInit(): void {
    this.pacientesAll();
  }

  private pacientesAll(): void {
    this.pacientesList = [];
    this.serialNumberArray = [];

    this.pacientesService.getPacientesAll().subscribe({
      next: (datosPACIENTES: any) => {
        this.datosPACIENTES = datosPACIENTES;

        this.datosPACIENTES.forEach((dataPAC: any) => {
          dataPAC.fullname =
            dataPAC.apellido_paterno +
            ' ' +
            dataPAC.apellido_materno +
            ' ' +
            dataPAC.nombres;
        });

        this.totalData = this.datosPACIENTES.length;

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosPACIENTES.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
        this.clienteallError = errorData;
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Pacientes>(this.pacientesList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosPACIENTES.map((res: Pacientes, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.pacientesList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.pacientesList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosPACIENTES)
    const filteredData = this.datosPACIENTES.filter((paciente: Pacientes) => {
      return (
        (paciente.paciente_id &&
          paciente.paciente_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (paciente.fullname &&
          paciente.fullname.toLowerCase().includes(value.toLowerCase())) ||
        (paciente.fecha_nacimiento &&
          paciente.fecha_nacimiento
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (paciente.paciente_direccion &&
          paciente.paciente_direccion
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (paciente.paciente_telefono &&
          paciente.paciente_telefono
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (paciente.paciente_tipo &&
          paciente.paciente_tipo.toLowerCase().includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.pacientesList
    this.pacientesList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosPACIENTES.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Pacientes>(this.pacientesList);
  }

  public sortData(sort: Sort) {
    const data = this.pacientesList.slice();

    if (!sort.active || sort.direction === '') {
      this.pacientesList = data;
    } else {
      this.pacientesList = data.sort((a, b) => {
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
      this.pacientesAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.pacientesAll();
    }
    this.dataSource = new MatTableDataSource<Pacientes>(this.pacientesList); // Agregar esta línea
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
    this.pacientesAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.pacientesAll();
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
