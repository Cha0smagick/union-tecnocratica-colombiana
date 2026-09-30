/**
 * Caso Diario - expansor de tarjetas por persona.
 * No depende de ningun backend: solo muestra y oculta el detalle ya presente en el HTML.
 */

const BOTON_DETALLE = 'Ver el detalle';
const BOTON_OCULTO = 'Ocultar detalle';

function iniciarCasoDiario() {
  const botones = document.querySelectorAll('.cd-toggle');

  botones.forEach((boton) => {
    const idDestino = boton.getAttribute('aria-controls');
    const destino = idDestino ? document.getElementById(idDestino) : null;

    if (!destino) {
      return;
    }

    boton.addEventListener('click', () => {
      const estaAbierto = boton.getAttribute('aria-expanded') === 'true';

      if (estaAbierto) {
        destino.hidden = true;
        boton.setAttribute('aria-expanded', 'false');
        boton.textContent = BOTON_DETALLE;
        return;
      }

      destino.hidden = false;
      boton.setAttribute('aria-expanded', 'true');
      boton.textContent = BOTON_OCULTO;
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarCasoDiario);
} else {
  iniciarCasoDiario();
}