<?php
$targetDir = "images/";  // Directorio de destino para guardar las imágenes
$uploadedFile = $_FILES['imagen'];

if ($uploadedFile['error'] === 0) {
    $fileName = time() . '_' . $uploadedFile['name'];
    $targetPath = $targetDir . $fileName;

    if (move_uploaded_file($uploadedFile['tmp_name'], $targetPath)) {
        echo "La imagen se ha cargado con éxito. Nombre del archivo: $fileName";
    } else {
        echo "Error al guardar la imagen.";
    }
} else {
    echo "Error al cargar la imagen.";
}
