// DOCUMENTO JAVASCRIPT DE plantas.php

$(document).ready(function() {
	obtener_fincas_usuario();
	cambiar_color_botones();
	validar_selector_finca();
	generar_codigos_qr();
	obtener_estados_grupos();
});

function cambiar_color_botones() {
	$("#flecha-izquierda").hover(
			function() {
				$(this).css('background-image', 'url("images/iconos/negro/flecha-izquierda.png")');
				$(this).css('cursor', 'pointer');
			}, function() {
				$(this).css('background-image', 'url("images/iconos/blanco/flecha-izquierda.png")');
			}
	);
	$("#flecha-derecha").hover(
			function() {
				$(this).css('background-image', 'url("images/iconos/negro/flecha-derecha.png")');
				$(this).css('cursor', 'pointer');
			}, function() {
				$(this).css('background-image', 'url("images/iconos/blanco/flecha-derecha.png")');
			}
	);
	$(".contenedor-huerto").hover(
			function() {
				$(this).css('background-color', '#F7DB5C');
				$(this).css('color', '#2A2B2A');
				$(this).css('cursor', 'pointer');
			}, function() {
				$(this).css('background-color', '#2A2B2A');
				$(this).css('color', '#FFFFFF');
			}
	);
}

function obtener_fincas_usuario() {
	$.ajax({
        type: 'POST',
        url: 'http://localhost/GricApp/Web/php/obtener_fincas_usuario.php',
				dataType: 'json',
				success: function(datos) {
						$(datos).each(function(i, valor) {
							insertar_finca_formato(valor.codigo, valor.nombre);
						});
        }
    });
}

function insertar_finca_formato(codigo, nombre) {
		var formato_finca = "<option value='" + codigo + "'>" + nombre + "</option>";
		document.getElementById('selector-finca').innerHTML += formato_finca;
}

function validar_selector_finca() {
	document.getElementById('selector-finca').onchange = function() {
		document.getElementById('selector-huerto').innerHTML = "<option value='' disabled selected hidden>Seleccione un huerto...</option>";
		obtener_huertos_usuario(document.getElementById('selector-finca').value);
		$(".contenedor-seleccion-huerto").slideDown();
	};
}

function obtener_huertos_usuario(codigo_finca) {
	$.ajax({
        type: 'POST',
        url: 'http://localhost/GricApp/Web/php/obtener_huertos_usuario.php',
				dataType: 'json',
				data: "finca="+codigo_finca,
				success: function(datos) {
					$(datos).each(function(i, valor) {
						insertar_huerto_formato(valor.codigo, valor.nombre);
					});
        }
    });
}

function insertar_huerto_formato(codigo, nombre) {
		var formato_huerto = "<option value='" + codigo + "'>" + nombre + "</option>";
		document.getElementById('selector-huerto').innerHTML += formato_huerto;
}

function validar_selector_huertos() {
	document.getElementById('seleccion-plantas').innerHTML = "";
	$('.contenedor-mensaje-cargando').fadeIn();
	setTimeout(function() {
		$('.contenedor-mensaje-cargando').fadeOut();
	}, 1100);
	setTimeout(function() {
		$('#seleccion-plantas').fadeIn();
		obtener_plantas_usuario(document.getElementById('selector-huerto').value);
	}, 1500);
	setTimeout(function() {
		seleccion_plantas_accion();
	}, 1800);
}

function obtener_plantas_usuario(codigo_huerto) {
	$.ajax({
        type: 'POST',
        url: 'http://localhost/GricApp/Web/php/obtener_plantas_usuario.php',
				dataType: 'json',
				data: "huerto="+codigo_huerto,
				success: function(datos) {
					$(datos).each(function(i, valor) {
						insertar_planta_formato(valor.codigo, valor.nombre);
					});
        }
    });
}

function insertar_planta_formato(codigo, nombre) {
		var formato_planta = "<div class='planta' id='" + codigo + "'>" +
		                      	"<div class='nombre-planta-identificador' id='nombre-planta-" + codigo + "'>" + codigo + " " + nombre + "</div>" +
		                        "<div class='icono-codigo-qr' id='icono-qr-" + codigo + "'></div>" +
		                     "</div>";
		document.getElementById('seleccion-plantas').innerHTML += formato_planta;
}

function seleccion_plantas_accion() {
	$('.planta').hover(
		function() {
			identificador = $(this).attr('ID');
			$('#' + identificador).css('background-color', '#F7DB5C');
			$('#' + identificador).css('cursor', 'pointer');
			$('#nombre-planta-' + identificador).css('color', '#2A2B2A');
			$('#icono-qr-' + identificador).css('background-image', 'url("images/iconos/codigo-qr-seleccionado.png")');
			}, function() {
			identificador = $(this).attr('ID');
			$('#' + identificador).css('background-color', '#FFFFFF');
			$('#nombre-planta-' + identificador).css('color', '#2A2B2A');
			$('#icono-qr-' + identificador).css('background-image', 'url("images/iconos/codigo-qr.png")');
			}
	);
	$('.planta').click(function() {
			$("#nombre-planta-seleccionada").css('display', 'none');
			document.getElementById('nombre-seleccionada').innerHTML = "";
			$("#nombre-planta-seleccionada").css('width', '0%');
			identificador = $(this).attr('ID');
			$("#nombre-planta-seleccionada").fadeIn();
			setTimeout(function() {
				document.getElementById('nombre-seleccionada').innerHTML = document.getElementById('nombre-planta-' + identificador).innerHTML;
			}, 700);
			$("#nombre-planta-seleccionada").animate({'width': '100%'}, "slow");
			document.getElementById('estados-planta-seleccionada').innerHTML = "";
			setTimeout(function() {
				$('.seleccion-estados-planta-seleccionada').fadeIn();
				obtener_planta_estados(identificador);
			}, 1000);
	});
}

function obtener_planta_estados(codigo_planta) {
	$.ajax({
        type: 'POST',
        url: 'http://localhost/GricApp/Web/php/obtener_plantas_estados.php',
				dataType: 'json',
				data: "planta="+codigo_planta,
				success: function(datos) {
					$(datos).each(function(i, valor) {
						insertar_estados_formato(valor.codigo, valor.nombre);
					});
        }
    });
}

function insertar_estados_formato(codigo, nombre) {
		var formato_estado = "<div class='estado-planta' id='" + codigo + "'>" + nombre + "</div>";
		document.getElementById('estados-planta-seleccionada').innerHTML += formato_estado;
}

function obtener_estados_grupos() {
	$.ajax({
        type: 'POST',
        url: 'http://localhost/GricApp/Web/php/obtener_estados_grupos.php',
				dataType: 'json',
				success: function(datos) {
					insertar_estados_grupos(datos[0], datos[1]);
        }
    });
}

function insertar_estados_grupos(estados, grupos) {
		$(estados).each(function(i, valor) {
			var formato_option_select = "<option value='" + valor.codigo + "'>" + valor.nombre + "</option>";
			document.getElementById('estados-select').innerHTML += formato_option_select;
		});
		$(grupos).each(function(i, valor) {
			var formato_option_select = "<option value='" + valor.estados + "'>" + valor.nombre + "</option>";
			document.getElementById('grupos-select').innerHTML += formato_option_select;
		});
}

function generar_codigos_qr() {
	$('#boton_generar_codigo').click(function() {
		document.getElementById('codigo-qr').innerHTML = "";
		var identificador_planta = document.getElementById('nombre-seleccionada').innerHTML;
		var estados_planta = "";
		contenedor_estados = document.getElementById('estados-planta-seleccionada').getElementsByClassName('estado-planta');
		for (i = 0; i < contenedor_estados.length; i++) {
			identificador = $(contenedor_estados[i]).attr('ID');
			if (i != (contenedor_estados.length - 1)) {
				estados_planta += identificador + " ";
			}
			else {
				estados_planta += identificador;
			}
		}
		var texto_codigo = identificador_planta + " - " + estados_planta;
		var codigo_qr = kjua({text: texto_codigo});
		var codigo_qr_valido = new Image();
		document.getElementById('codigo-qr').appendChild(codigo_qr);
		var crossorigin = $('#codigo-qr img').attr('crossorigin');
		var src         = $('#codigo-qr img').attr('src');
		codigo_qr_valido.crossorigin = crossorigin;
		codigo_qr_valido.src         = src;
		document.getElementById('codigo-qr').innerHTML = "";
		document.getElementById('codigo-qr').appendChild(codigo_qr_valido);
		var nombre_imagen = identificador_planta.replace(" ", "_").toLowerCase();
		var a = "<a href='" + src + "' download='" + nombre_imagen + "'>Descargar código QR</a>";
		document.getElementById('boton_descargar_imagen').innerHTML = a;
		var p = $('#boton_descargar_imagen a').attr('href');
	});
}
