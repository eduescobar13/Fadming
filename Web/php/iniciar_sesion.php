<?php
	session_start();
	require("conectar_basedatos.php");
	define('ERROR_LOGIN', '-1');
	define('LOGIN_CORRECTO', '1');

  $usuario    = $_POST['usuario'];
  $contrasena = $_POST['contrasena'];

  $clave = 'gricapp, una aplicación del futuro';
  $contrasena_encriptada = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($clave), $contrasena, MCRYPT_MODE_CBC, md5(md5($clave))));

  $consulta = "SELECT ID_USUARIO, TIPO, EMPRESA, ROL, IMAGEN
	    		     FROM USUARIO
	    		     WHERE ((NOMBRE_USUARIO = '$usuario') AND (CONTRASENA = '$contrasena_encriptada'))
	    		     LIMIT 1;";

	$resultado_consulta = mysql_query($consulta);
	$datos = mysql_fetch_array($resultado_consulta);
	$imagen_base64 = base64_encode($datos[4]); // Codificación de la imagen a base64.

	if(!is_null($datos[0])) {
		$informacion[] = array('respuesta'=> LOGIN_CORRECTO);
		$_SESSION['identificador'] = $datos[0];
		$_SESSION['usuario'] = $usuario;
		$_SESSION['tipo'] = $datos[1];
		$_SESSION['empresa'] = $datos[2];
		$_SESSION['rol'] = $datos[3];
		$_SESSION['imagen'] = $imagen_base64;
	}
	else {
		$informacion[] = array('respuesta'=> ERROR_LOGIN);
	}
	echo json_encode($informacion);
?>
