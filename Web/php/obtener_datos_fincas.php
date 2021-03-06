<?php
	session_start();
  require("conectar_basedatos.php");
	define('CLIENTE_PARTICULAR', '1');
	define('CLIENTE_EMPRESA', '2');

  $identificador = $_SESSION['identificador'];
	$tipo_usuario = $_SESSION['tipo'];
	$empresa = $_SESSION['empresa'];

	if ($tipo_usuario == CLIENTE_EMPRESA) {
		$consulta = "SELECT FINC.CODIGO, FINC.NOMBRE, DATE_FORMAT(FINC.FECHA_REGISTRO, '%d %Y') DIA_ANIO, DATE_FORMAT(FINC.FECHA_REGISTRO, '%c') MES, FINC.IMAGEN
								 FROM FINCA FINC
								 WHERE (CODIGO_USUARIO IN (SELECT ID_USUARIO
																					 FROM USUARIO
																					 WHERE (EMPRESA = '$empresa')));";
	}
	else if ($tipo_usuario == CLIENTE_PARTICULAR) {
		$consulta = "SELECT FINC.CODIGO, FINC.NOMBRE, DATE_FORMAT(FINC.FECHA_REGISTRO, '%d %Y') DIA_ANIO, DATE_FORMAT(FINC.FECHA_REGISTRO, '%c') MES, FINC.IMAGEN
								 FROM FINCA FINC
	               WHERE (CODIGO_USUARIO = '$identificador')
	               ORDER BY NOMBRE ASC";
	}
	$resultado_consulta = mysql_query($consulta);
	while($fila = mysql_fetch_row($resultado_consulta)) {
		if (!is_null($fila[4])) {
			$imagen = base64_encode($fila[4]); // Codificación de la imagen a base64.
		}
		else {
			$imagen = null;
		}
		$codigo_finca = $fila[0];
		$consulta_huertos = "SELECT COUNT(*)
												 FROM HUERTO
												 WHERE (CODIGO_FINCA = '$codigo_finca')
												 LIMIT 1;";
		$resultado_consulta_huertos = mysql_query($consulta_huertos);
		$datos_huertos = mysql_fetch_row($resultado_consulta_huertos);
		$numero_huertos = $datos_huertos[0];
		if ($numero_huertos != 0) {
			$consulta_plantas = "SELECT COUNT(PLAN.CODIGO)
													 FROM FINCA FINC, HUERTO HUER, PLANTA PLAN
													 WHERE ((FINC.CODIGO = HUER.CODIGO_FINCA) AND (HUER.CODIGO = PLAN.CODIGO_HUERTO) AND (HUER.CODIGO_FINCA = '$codigo_finca'))
													 LIMIT 1;";
			$resultado_consulta_plantas = mysql_query($consulta_plantas);
			$datos_plantas = mysql_fetch_row($resultado_consulta_plantas);
			$numero_plantas = $datos_plantas[0];
			$consulta_usuarios = "SELECT COUNT(DISTINCT CODIGO_USUARIO)
													  FROM HUERTO_PERMISO
													  WHERE (CODIGO_HUERTO IN (SELECT CODIGO
                         													   FROM HUERTO
                         												     WHERE (CODIGO_FINCA = '$codigo_finca')))
													  LIMIT 1;";
			$resultado_consulta_usuarios = mysql_query($consulta_usuarios);
			$datos_usuarios = mysql_fetch_row($resultado_consulta_usuarios);
			$numero_usuarios = $datos_usuarios[0];
		}
		else {
			$numero_plantas = 0;
			$numero_usuarios = 0;
		}
		$informacion[] = array('codigo' => $codigo_finca,
													 'nombre' => $fila[1],
													 'dia_anio' => $fila[2],
													 'mes' => $fila[3],
	                         'numero_huertos' => $numero_huertos,
													 'numero_plantas' => $numero_plantas,
													 'numero_usuarios' => $numero_usuarios,
												   'imagen' => $imagen);
	}
	echo json_encode($informacion);
?>
