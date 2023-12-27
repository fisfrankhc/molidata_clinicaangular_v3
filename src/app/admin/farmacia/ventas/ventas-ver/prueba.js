actualizarVenta() {
    if (this.form.valid) {
      //console.log(this.form.value);
      const ventaData = {
        id: this.ventaId,
        proceso: 'CONFIRMADO',
      };
      this.ventasService.updatedVenta(ventaData).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (errorData) => {
          console.log(errorData);
        },
        complete: () => {
          this.router.navigate(['/farmacia/caja']);
        },
      });
    }
}
  