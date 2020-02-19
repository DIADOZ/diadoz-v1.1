/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import { start } from './control';

const text = 'New insights can develop into new approaches. Our insights and achievements over the last year have allowed us to find new directions, to better our approach, and to fine tune our output.';

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

function start3D() {
  start();
}

function init() {
  // start game
  // start typing effect
  typingEffect(text, 0);
  // fade in elements
  // 3d controls
  start3D();
}

init();
