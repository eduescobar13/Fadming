<?php
	session_start();
  require("conectar_basedatos.php");

	$numero_fila = 0;
	$codigo_huerto = 1;//$_POST['huerto'];
	$consulta = "SELECT CODIGO, NOMBRE
							 FROM PLANTA
							 WHERE (CODIGO_HUERTO = '$codigo_huerto')
							 ORDER BY NOMBRE ASC;";

	$resultado_consulta = mysql_query($consulta);
	while($fila = mysql_fetch_row($resultado_consulta)) {
		$informacion[$numero_fila] = array('codigo' => $fila[0],
																			 'nombre' => $fila[1]);
		$numero_fila = $numero_fila + 1;
	}
	echo json_encode($informacion);
?>
