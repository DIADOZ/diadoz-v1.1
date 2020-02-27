/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import '@fortawesome/fontawesome-free/js/fontawesome';
// import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/brands';
import 'normalize.css';
import './index.css';
import { WEBGL } from 'three/examples/jsm/WebGL';

import {
  start,
} from './control';

const text = 'New insights can develop into new approaches. Our insights and achievements over the last year have allowed us to find new directions, to better our approach, and to fine tune our output.';

function start3D() {
  if (WEBGL.isWebGLAvailable()) {
    start();
  } else {
    const warning = WEBGL.getWebGLErrorMessage();
    document.querySelector('#container').appendChild(warning);
  }
  // 3d letters spread out floating and flying around
  // load models, create movement,
  // create on click snap to center,
  // create transition out once all letters clicked
}

function typingEffect(phrase, i) {
  // check if index is less than phrase length
  if (i < (phrase.length)) {
    document.querySelector('#description').innerHTML = `${phrase.substring(0, i + 1)}<span id="caret"></span>`;
    setTimeout(() => {
      typingEffect(phrase, i + 1);
    }, 50); // make this random between 50-100
  }
  // could create a code like scene?

  return false;
}

function init() {
  // start game
  start3D();
  // start typing effect
  typingEffect(text, 0);
  // fade in elements
}

init();
