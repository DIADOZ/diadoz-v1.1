/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import { start } from './control';

const text = 'New insights can develop into new approaches. Our insights and achievements over the last year have allowed us to find new directions, to better our approach, and to fine tune our output.';

// type one text in the typwriter
// keeps calling itself until the text is finished
// function typeWriter(text, i, fnCallback) {
//   // chekc if text isn't finished yet
//   if (i < (text.length)) {
//     // add next character to h1

//     // wait for a while and call this function again for next character
//     setTimeout(function() {
//       typeWriter(text, i + 1, fnCallback)
//       }, 100);
//   }
//   else if (typeof fnCallback == 'function') {
//     // call callback after timeout
//     // text finished, call callback if there is a callback function
//     setTimeout(fnCallback, 700);
//   }
// }

function typingEffect(phrase, i) {
  // check if text is done
  // if text done return to be able to show elements
  if (i < (phrase.length)) {
    document.querySelector('#description').textContent = phrase.substring(0, i + 1);
    setTimeout(() => {
      typingEffect(phrase, i + 1);
    }, 50); // make this random
  }
  // if text still
  // could create a code like scene?
  // take text and input it character by character
  // blinking cursor "|" (3x?)
  // begins typing
  // taking pauses like a human would
  // return true once done??

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
