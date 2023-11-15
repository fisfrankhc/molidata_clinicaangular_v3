
  generarPDF() {
    //const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a5',
      orientation: 'portrait', // Ajusta según tu preferencia
    });

    // Obtén el contenido del div
    const contenidoDiv = document.getElementById('ticketEmitir')!; // Reemplaza 'tuDiv' con el ID de tu div
    const anchoContenido = 80; // Ancho en milímetros

    // Verifica que el div exista antes de continuar
    if (contenidoDiv) {
      contenidoDiv.style.width = `${anchoContenido}mm`;
      // Agrega el contenido del div al PDF
      pdf.html(contenidoDiv, {
        callback: (pdf) => {
          // Guarda el PDF después de cargar el contenido
          pdf.save('tu-archivo.pdf');
        },
      });
    } else {
      console.error('Elemento no encontrado:', contenidoDiv);
    }
  }