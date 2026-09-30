/**
 * Buzon de Problemas y Soluciones.
 * Todo ocurre en el navegador: los reportes se guardan en localStorage
 * y la respuesta de la UTC se muestra al instante, sin enviar nada a un servidor.
 */

const CLAVE = 'utc.buzon.v1';
const MAX_CARACTERES = 600;

/** Respuesta de la UTC para cada tipo de problema reportado. */
const RESPUESTAS = {
  huecos: {
    titulo: 'Huecos en la via',
    acciones: 'Levantar la placa, medir el dano y programar la reparacion.',
    responsable: 'Secretaria de Obras Civiles de la alcaldia.',
    plazo: 'Diez dias habiles para la reparacion de emergencia.',
    control: 'El avance se publica con foto y fecha en la pagina de la alcaldia.',
  },
  agua: {
    titulo: 'Falta de agua',
    acciones: 'Revisar la tuberia del sector, limpiar los tanques y reprogramar el suministro.',
    responsable: 'Empresa de acueducto del municipio.',
    plazo: 'Veinticuatro horas para abrir el diagnostico.',
    control: 'El consumidor puede pedir el historial de cortes por direccion.',
  },
  luz: {
    titulo: 'Falta de luz',
    acciones: 'Revisar postes, transformadores y el tablero del circuito.',
    responsable: 'Operador de energia electrica.',
    plazo: 'Setenta y dos horas para una falla reportada.',
    control: 'La falla queda registrada con numero de caso y fecha de cierre.',
  },
  basura: {
    titulo: 'Basura sin recoger',
    acciones: 'Registrar el punto, ajustar la ruta de recoleccion y poner sensores de llenado en los contenedores.',
    responsable: 'Secretaria de Aseo o operador contracted.',
    plazo: 'Cuarenta y ocho horas para retirar el punto.',
    control: 'Los contenedores con sensor avisan cuando estan llenos y la ruta se ajusta.',
  },
  inseguridad: {
    titulo: 'Inseguridad',
    acciones: 'Revisar camaras del sector, reforzar iluminacion y ordenar el patrullaje nocturno.',
    responsable: 'Comando de la Policia, con apoyo de la guardia.',
    plazo: 'Setenta y dos horas para la primera revision del sector.',
    control: 'Cada intervencion queda en un parte publico con hora y resultado.',
  },
  transporte: {
    titulo: 'Problemas de transporte',
    acciones: 'Medir tiempos reales, ajustar semaforos y ordenar paraderos y rutas.',
    responsable: 'Secretaria de Movilidad.',
    plazo: 'Treinta dias para medir el sector.',
    control: 'Los semaforos se ajustan con datos, no con reloj fijo.',
  },
  salud: {
    titulo: 'Dificultad para obtener atencion en salud',
    acciones: 'Abrir agenda unificada, historia clinica en el celular y entrega de medicamentos a tiempo.',
    responsable: 'Secretaria de Salud y subredes.',
    plazo: 'Cuarenta y ocho horas para la cita mas urgente.',
    control: 'El paciente puede consultar su historia clinica desde cualquier celular.',
  },
  espacio: {
    titulo: 'Espacio publico en mal estado',
    acciones: 'Recuperar el espacio, iluminacion, arbolado y acceso paratodos.',
    responsable: 'Secretaria de Espacio Publico.',
    plazo: 'Noventa dias para el proyecto completo.',
    control: 'Cada intervencion se publica con presupuesto y fecha.',
  },
  otro: {
    titulo: 'Otro problema',
    acciones: 'Revisar el caso, clasificarlo y asignarlo al equipo que lo puede resolver.',
    responsable: 'El equipo territorial de la UTC en ese municipio.',
    plazo: 'Cinco dias habiles para la primera respuesta.',
    control: 'La respuesta queda registrada con nombre y fecha.',
  },
};

const NOMBRES_LOCALIDAD = {
  usaquen: 'Usaquen',
  suba: 'Suba',
  kennedy: 'Kennedy',
  engativa: 'Engativa',
  bosa: 'Bosa',
  'san-cristobal': 'San Cristobal',
  chapinero: 'Chapinero',
  teusaquillo: 'Teusaquillo',
  'barrios-unidos': 'Barrios Unidos',
  'la-francia': 'La Francia',
  fontibon: 'Fontibon',
  torca: 'Torca',
  'puente-aranda': 'Puente Aranda',
  candela: 'La Candelaria',
  majumbia: 'Majumbal',
  'santa-fe': 'Santa Fe',
  'los-martires': 'Los Martires',
  sumapaz: 'Sumapaz',
  otra: 'Otra localidad',
};

function leerReportes() {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) {
      return [];
    }
    const lista = JSON.parse(crudo);
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];
  }
}

function guardarReportes(lista) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch (error) {
    // Si el navegador bloquea el almacenamiento, la pagina sigue funcionando
    // aunque el reporte no sobreviva al cierre.
  }
}

function textoDe(select, valor) {
  const opcion = select.querySelector('option[value="' + valor + '"]');
  return opcion ? opcion.textContent.trim() : valor;
}

function pintarLista(lista) {
  const contenedor = document.getElementById('bz-lista');
  const vacio = document.getElementById('bz-vacio');

  if (!contenedor || !vacio) {
    return;
  }

  contenedor.innerHTML = '';
  vacio.hidden = lista.length > 0;

  lista.forEach(function (reporte) {
    const item = document.createElement('li');
    item.className = 'bz-item';

    const titulo = document.createElement('p');
    titulo.className = 'bz-item-titulo';
    titulo.textContent = RESPUESTAS[reporte.tipo]
      ? RESPUESTAS[reporte.tipo].titulo
      : 'Problema reportado';

    const lugar = document.createElement('p');
    lugar.className = 'bz-item-meta';
    lugar.textContent = reporte.lugar + ' - ' + reporte.localidad;

    const fecha = document.createElement('p');
    fecha.className = 'bz-item-meta';
    fecha.textContent = 'Enviado el ' + reporte.fecha;

    const borrar = document.createElement('button');
    borrar.type = 'button';
    borrar.className = 'btn btn-sm btn-ghost';
    borrar.textContent = 'Borrar';
    borrar.addEventListener('click', function () {
      const actual = leerReportes().filter(function (itemActual) {
        return itemActual.id !== reporte.id;
      });
      guardarReportes(actual);
      pintarLista(actual);
      pintarRanking(actual);
    });

    item.appendChild(titulo);
    item.appendChild(lugar);
    item.appendChild(fecha);
    item.appendChild(borrar);
    contenedor.appendChild(item);
  });
}

function pintarRanking(lista) {
  const contenedor = document.getElementById('bz-ranking');
  if (!contenedor) {
    return;
  }

  contenedor.innerHTML = '';

  const conteo = {};
  lista.forEach(function (reporte) {
    conteo[reporte.tipo] = (conteo[reporte.tipo] || 0) + 1;
  });

  const claves = Object.keys(conteo).sort(function (a, b) {
    return conteo[b] - conteo[a];
  });

  if (claves.length === 0) {
    const vacio = document.createElement('li');
    vacio.className = 'bz-vacio';
    vacio.textContent = 'Todavia no hay reportes guardados en este navegador.';
    contenedor.appendChild(vacio);
    return;
  }

  claves.forEach(function (clave) {
    const item = document.createElement('li');
    item.className = 'bz-ranking-item';

    const nombre = document.createElement('span');
    nombre.className = 'bz-ranking-nombre';
    nombre.textContent = RESPUESTAS[clave] ? RESPUESTAS[clave].titulo : clave;

    const numero = document.createElement('span');
    numero.className = 'bz-ranking-numero';
    numero.textContent = String(conteo[clave]);

    item.appendChild(nombre);
    item.appendChild(numero);
    contenedor.appendChild(item);
  });
}

function pintarRespuesta(reporte) {
  const caja = document.getElementById('bz-respuesta');
  if (!caja) {
    return;
  }

  const respuesta = RESPUESTAS[reporte.tipo] || RESPUESTAS.otro;

  caja.innerHTML = '';
  caja.hidden = false;

  const titulo = document.createElement('h3');
  titulo.className = 'bz-respuesta-titulo';
  titulo.textContent = 'Respuesta de la UTC: ' + respuesta.titulo;

  const lista = document.createElement('ul');
  lista.className = 'bz-respuesta-lista';

  const campos = [
    ['Que se hace', respuesta.acciones],
    ['Quien lo hace', respuesta.responsable],
    ['En cuanto tiempo', respuesta.plazo],
    ['Como se verifica', respuesta.control],
  ];

  campos.forEach(function (campo) {
    const item = document.createElement('li');
    const etiqueta = document.createElement('strong');
    etiqueta.textContent = campo[0] + ': ';
    item.appendChild(etiqueta);
    item.appendChild(document.createTextNode(campo[1]));
    lista.appendChild(item);
  });

  caja.appendChild(titulo);
  caja.appendChild(lista);
}

function iniciarBuzon() {
  const formulario = document.getElementById('bz-form');
  const descripcion = document.getElementById('bz-descripcion');
  const cuenta = document.getElementById('bz-cuenta');

  if (descripcion && cuenta) {
    const actualizarCuenta = function () {
      cuenta.textContent = String(descripcion.value.length);
    };
    descripcion.addEventListener('input', actualizarCuenta);
    actualizarCuenta();
  }

  pintarLista(leerReportes());
  pintarRanking(leerReportes());

  if (!formulario) {
    return;
  }

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    const tipo = document.getElementById('bz-tipo');
    const lugar = document.getElementById('bz-lugar');
    const localidad = document.getElementById('bz-localidad');

    const reporte = {
      id: String(Date.now()),
      tipo: tipo ? tipo.value : 'otro',
      lugar: lugar ? lugar.value.trim() : '',
      localidad: localidad ? textoDe(localidad, localidad.value) : 'No aplica',
      descripcion: descripcion ? descripcion.value.trim() : '',
      fecha: new Date().toLocaleDateString('es-CO'),
    };

    const lista = leerReportes();
    lista.unshift(reporte);
    guardarReportes(lista);

    pintarRespuesta(reporte);
    pintarLista(lista);
    pintarRanking(lista);

    formulario.reset();
    if (cuenta) {
      cuenta.textContent = '0';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarBuzon);
} else {
  iniciarBuzon();
}