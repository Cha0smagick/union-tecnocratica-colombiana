/**
 * Bogota Cero Trancon y Cero Miedo.
 * Tres modulos que trabajan en el navegador: calculadora de tiempo perdido,
 *Encuesta por localidad y postulacion a liderazgo local.
 */

const CLAVE_VOTOS = 'utc.bogota.votos.v1';
const CLAVE_POSTULOS = 'utc.bogota.postulaciones.v1';

/** Minutos aproximados de viaje en hora pico, en un solo sentido, hacia el centro. */
const MINUTOS_PICO = {
  suba: 75,
  'san-cristobal': 70,
  kennedy: 65,
  engativa: 60,
  bosa: 55,
  usaquen: 50,
};

const NOMBRE_LOCALIDAD = {
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
  'antonio-narino': 'Antonio Narino',
  'jose-cristino': 'Jose Cristino',
};

const PROBLEMAS = [
  { id: 'huecos', texto: 'Huecos en las vias' },
  { id: 'iluminacion', texto: 'Mal iluminacion' },
  { id: 'microtrafico', texto: 'Microtrafico' },
  { id: 'basuras', texto: 'Basuras sin recoger' },
  { id: 'transporte', texto: 'Transporte lento' },
  { id: 'espacio', texto: 'Parques y espacio publico' },
];

/** En hora valle se usa el 60 por ciento del tiempo de hora pico. */
const FACTOR_VALLE = 0.6;
const DIAS_AL_ANO = 250;
const MINUTOS_POR_DIA = 1440;
const REDUCCION_OBJETIVO = 0.25;

function leer(clave) {
  try {
    const crudo = window.localStorage.getItem(clave);
    if (!crudo) {
      return {};
    }
    const objeto = JSON.parse(crudo);
    return objeto && typeof objeto === 'object' ? objeto : {};
  } catch (error) {
    return {};
  }
}

function guardar(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    // Sin almacenamiento el modulo sigue funcionando en memoria.
  }
}

function crearLista(texto) {
  const item = document.createElement('li');
  item.className = 'bg-vote-item';
  item.textContent = texto;
  return item;
}

/* ---------- 1. Calculadora de tiempo perdido ---------- */

let formulario = null;

function pintarCalculo() {
  const salida = document.getElementById('bg-calc-out');
  const origen = document.getElementById('bg-origen');
  const momento = document.getElementById('bg-momento');

  if (!salida || !formulario) {
    return;
  }

  if (!origen || !origen.value) {
    salida.hidden = true;
    return;
  }

  const pico = !momento || momento.value !== 'valle';
  const base = MINUTOS_PICO[origen.value] || 60;
  const minutos = pico ? base : Math.round(base * FACTOR_VALLE);

  const minutosAnio = minutos * 2 * DIAS_AL_ANO;
  const diasAntes = minutosAnio / MINUTOS_POR_DIA;
  const diasDespues = diasAntes * (1 - REDUCCION_OBJETIVO);
  const diasRecuperados = diasAntes - diasDespues;
  const horasRecuperadas = (diasRecuperados * 24).toFixed(1);
  const nombre = NOMBRE_LOCALIDAD[origen.value] || origen.value;

  salida.innerHTML = '';
  salida.hidden = false;

  const titulo = document.createElement('h3');
  titulo.className = 'bg-calc-titulo';
  titulo.textContent = nombre + ' hacia el centro';

  const condicion = document.createElement('p');
  condicion.className = 'bg-calc-sub';
  condicion.textContent = pico
    ? 'Hora pico. Un viaje de ' + minutos + ' minutos.'
    : 'Hora valle, estimado en el 60 por ciento de la hora pico: ' + minutos + ' minutos.';

  const lista = document.createElement('ul');
  lista.className = 'bg-calc-lista';

  const filas = [
    ['Hoy pierdes', diasAntes.toFixed(1) + ' dias al ano'],
    ['Con la propuesta UTC', diasDespues.toFixed(1) + ' dias al ano'],
    ['Recuperas', diasRecuperados.toFixed(1) + ' dias, unos ' + horasRecuperadas + ' horas'],
  ];

  filas.forEach(function (fila) {
    const item = crearLista(fila[0] + ': ' + fila[1]);
    item.className = 'bg-calc-item';
    lista.appendChild(item);
  });

  const formula = document.createElement('p');
  formula.className = 'bg-calc-formula';
  formula.textContent =
    'Como se calcula: minutos por viaje x 2 x 250 dias al ano, dividido entre 1440 minutos del dia. La propuesta UTC baja ese tiempo un 25 por ciento.';

  salida.appendChild(titulo);
  salida.appendChild(condicion);
  salida.appendChild(lista);
  salida.appendChild(formula);
}

function iniciarCalculadora() {
  formulario = document.getElementById('bg-calc-form');
  if (!formulario) {
    return;
  }

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }
    pintarCalculo();
  });
}

/* ---------- 2. Reporta y vota por tu localidad ---------- */

function pintarVotacion(localidad) {
  const panel = document.getElementById('bg-vote-panel');
  const titulo = document.getElementById('bg-vote-title');
  const total = document.getElementById('bg-vote-total');
  const opciones = document.getElementById('bg-vote-opts');
  const lista = document.getElementById('bg-vote-list');
  const vacio = document.getElementById('bg-vote-empty');

  if (!panel || !opciones || !lista || !vacio) {
    return;
  }

  panel.hidden = false;

  const votos = leer(CLAVE_VOTOS);
  const datos = votos[localidad] || {};
  let suma = 0;
  Object.keys(datos).forEach(function (clave) {
    suma += datos[clave];
  });

  if (titulo) {
    titulo.textContent = NOMBRE_LOCALIDAD[localidad] || localidad;
  }
  if (total) {
    total.textContent = suma === 1
      ? '1 voto registrado en este navegador.'
      : suma + ' votos registrados en este navegador.';
  }

  opciones.innerHTML = '';

  PROBLEMAS.forEach(function (problema) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'btn btn-secondary';
    boton.textContent = problema.texto;
    boton.addEventListener('click', function () {
      const todos = leer(CLAVE_VOTOS);
      if (!todos[localidad]) {
        todos[localidad] = {};
      }
      todos[localidad][problema.id] = (todos[localidad][problema.id] || 0) + 1;
      guardar(CLAVE_VOTOS, todos);
      pintarVotacion(localidad);
    });
    opciones.appendChild(boton);
  });

  lista.innerHTML = '';
  vacio.hidden = suma > 0;

  const orden = PROBLEMAS.slice().sort(function (a, b) {
    return (datos[b.id] || 0) - (datos[a.id] || 0);
  });

  orden.forEach(function (problema) {
    const cantidad = datos[problema.id] || 0;
    lista.appendChild(crearLista(problema.texto + ': ' + cantidad));
  });
}

function iniciarEncuesta() {
  const contenedor = document.getElementById('bg-loc-grid');
  if (!contenedor) {
    return;
  }

  Object.keys(NOMBRE_LOCALIDAD).forEach(function (clave) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'bg-loc-btn';
    boton.textContent = NOMBRE_LOCALIDAD[clave];
    boton.addEventListener('click', function () {
      pintarVotacion(clave);
    });
    contenedor.appendChild(boton);
  });
}

/* ---------- 3. Postulacion a liderazgo local ---------- */

function iniciarPostulacion() {
  const formularioPost = document.getElementById('bg-postulacion-form');
  const salida = document.getElementById('bg-postulacion-out');

  if (!formularioPost || !salida) {
    return;
  }

  formularioPost.addEventListener('submit', function (evento) {
    evento.preventDefault();

    if (!formularioPost.checkValidity()) {
      formularioPost.reportValidity();
      return;
    }

    const nombre = document.getElementById('bg-post-nombre');
    const zona = document.getElementById('bg-post-zona');
    const cargo = document.getElementById('bg-post-cargo');
    const motivo = document.getElementById('bg-post-motivo');

    const postulacion = {
      id: String(Date.now()),
      nombre: nombre ? nombre.value.trim() : '',
      zona: zona ? zona.value.trim() : '',
      cargo: cargo ? cargo.value : 'jal',
      motivo: motivo ? motivo.value.trim() : '',
      fecha: new Date().toLocaleDateString('es-CO'),
    };

    const lista = leer(CLAVE_POSTULOS);
    lista.postulaciones = Array.isArray(lista.postulaciones) ? lista.postulaciones : [];
    lista.postulaciones.unshift(postulacion);
    guardar(CLAVE_POSTULOS, lista);

    const cargos = {
      jal: 'Junta Administradora Local (ediles)',
      concejo: 'Concejo municipal',
      alcaldia: 'Alcaldia',
    };

    salida.innerHTML = '';
    salida.hidden = false;

    const titulo = document.createElement('h3');
    titulo.className = 'bg-calc-titulo';
    titulo.textContent = 'Postulacion registrada';

    const texto = document.createElement('p');
    texto.className = 'bg-calc-sub';
    texto.textContent =
      postulacion.nombre + ', guardamos tu postulacion a ' +
      (cargos[postulacion.cargo] || 'la JAL') + ' para ' + postulacion.zona + '.';

    const nota = document.createElement('p');
    nota.className = 'bg-calc-formula';
    nota.textContent =
      'Este registro queda en tu navegador. Contactaremos al correo que registraste para pedir la documentacion.';

    salida.appendChild(titulo);
    salida.appendChild(texto);
    salida.appendChild(nota);

    formularioPost.reset();
  });
}

function iniciar() {
  iniciarCalculadora();
  iniciarEncuesta();
  iniciarPostulacion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciar);
} else {
  iniciar();
}