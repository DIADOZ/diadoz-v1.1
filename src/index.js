import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/brands';
import { MDCTextField } from '@material/textfield';
import 'normalize.css';
import './index.css';
import { WEBGL } from 'three/examples/jsm/WebGL';


import { start } from './control';

const text =
  'New insights can develop into new approaches. Our insights and achievements over the last year have allowed us to find new directions, to better our approach, and to fine tune our output.';

function start3D() {
  if (WEBGL.isWebGLAvailable()) {
    start();
  } else {
    const warning = WEBGL.getWebGLErrorMessage();
    document.querySelector('#container').appendChild(warning);
  }
}

function typingEffect(phrase, i) {
  // check if index is less than phrase length
  if (i < phrase.length) {
    document.querySelector('#description').innerHTML = `${phrase.substring(
      0,
      i + 1
    )}<span id="caret"></span>`;
    setTimeout(() => {
      typingEffect(phrase, i + 1);
    }, 50); // TODO: make this random between 50-100
  }
}

export function fadeIn() {
  let allHiddenComponents = document.querySelectorAll('#container .hide');
  allHiddenComponents.forEach(component => {
    component.classList.remove('hide');
  });

  // typingEffect(text, 0);
}

function init() {
  typingEffect(text, 0);
  start3D();
}

init();
