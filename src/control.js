/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let container;
let camera;
let controls;
let renderer;
let scene;
const models = {};
let topLight;

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
const frustumSize = 20;

const xMin = (frustumSize * aspect + 0.1) / -2;
const xMax = (frustumSize * aspect) / 2 - 0.1;
const zMax = (frustumSize / 2) - 0.1;
const zMin = (frustumSize / -2) + 0.1;

const mixers = [];
const clock = new THREE.Clock();

export function start() {
  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000,
  );
  camera.position.y = 30;

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  createLights();
  loadModels();

  renderer = new THREE.WebGLRenderer({ alpha: 1 });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio);

  container = document.querySelector('#container');
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, container);

  window.addEventListener('resize', onWindowResize);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  for (const item in models) {
    const { x, z } = runModel({ x: models[item].position.x, z: models[item].position.z });
    models[item].position.x = x;
    models[item].position.z = z;
  }

  renderer.render(scene, camera);
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(0xfffff0, 5);

  topLight = new THREE.PointLight(0xcd712c, 5, 10, 2);
  topLight.castShadow = false;
  topLight.position.x = 0;
  topLight.position.y = 10;
  topLight.position.z = 0;

  scene.add(ambientLight, topLight);
}

function loadModels() {
  const loader = new GLTFLoader();

  // A reusable function to set up the models. Position parameter to move model
  const onLoad = (gltf) => {
    // console.log(dumpObject(gltf.scene).join('\n'));
    if (gltf.scene) {
      for (const item of gltf.scene.children) {
        // item.castShadow = true;
        item.position.x = randomNumber((frustumSize * aspect + 0.1) / -2, (frustumSize * aspect) / 2 - 0.1);
        item.position.z = randomNumber((frustumSize / 2) - 0.1, (frustumSize / -2) + 0.1);
        models[item.name] = item;
      }
    }
    for (const item in models) {
      scene.add(models[item]);
    }
  };
  const onProgress = (xhr) => {
    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
  };
  const onError = (errorMessage) => {
    console.log(errorMessage);
  };

  // model is loaded asynchronously,
  // const atlasPosition = new THREE.Vector3(0.02, 0, 0);
  loader.load(
    './assets/model/diadoz-official-blender.glb',
    (gltf) => onLoad(gltf),
    onProgress,
    onError,
  );
}

function onWindowResize() {
  camera.aspect = aspect;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}

function runModel(currentPosition, previousPosition) {
  const nextPosition = {};

  if (currentPosition.x < xMin) {
    nextPosition.x = currentPosition.x++;
  } else if (currentPosition.x > xMax) {
    nextPosition.x = currentPosition.x--;
  } else {
    // check where it was previously vs now and continue adding the same way
    nextPosition.x = ++currentPosition.x;
  }

  if (currentPosition.z < zMin) {
    nextPosition.z = currentPosition.z++;
  } else if (currentPosition.z > zMax) {
    nextPosition.z = currentPosition.z--;
  } else {
    // check where it was previously vs now and continue adding the same way
    
    nextPosition.z = ++currentPosition.z;
  }


  return nextPosition;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// container = document.querySelector('#scene');

//   scene = new THREE.Scene();

//   createCamera();
//   createLights();
//   loadModels();
//   createControls();
//   createRenderer();

//   window.addEventListener('resize', onWindowResize);

//   renderer.setAnimationLoop(() => {
//     controls.update();
//     update();
//     render();
//   });
// }

// function createCamera() {
//   // left, right, top, bottom, near, far
//   camera = new THREE.PerspectiveCamera(
//     45,
//     container.clientWidth / container.clientHeight,
//     0.1,
//     1000,
//   );
//   camera.position.x = 0;
//   camera.position.y = 15;
//   camera.position.z = 0;
// }


// // function dumpObject(obj, lines = [], isLast = true, prefix = '') {
// //   const localPrefix = isLast ? '└─' : '├─';
// //   lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
// //   const newPrefix = prefix + (isLast ? '  ' : '│ ');
// //   const lastNdx = obj.children.length - 1;
// //   obj.children.forEach((child, ndx) => {
// //     const isLast = ndx === lastNdx;
// //     dumpObject(child, lines, isLast, newPrefix);
// //   });
// //   return lines;
// // }

// export

// function createControls() {
//   controls = new OrbitControls(camera, container);
//   // controls.autoRotate = true;
//   // controls.autoRotateSpeed = 2;
//   controls.enableZoom = true;
//   controls.enableKeys = false;
//   controls.enablePan = false;
//   controls.maxPolarAngle = 1.6;
// }

// function createRenderer() {
//   // create a WebGLRenderer and set its width and height
//   renderer = new THREE.WebGLRenderer({ canvas: container, alpha: 1 });
//   renderer.setClearColor(new THREE.Color(0xff0000));
//   renderer.setClearAlpha(0);
//   renderer.setSize(container.clientWidth, container.clientHeight);

//   renderer.setPixelRatio(window.devicePixelRatio);

//   renderer.gammaFactor = 2.2;
//   renderer.gammaOutput = true;
// }

// function update() {
//   const delta = clock.getDelta();

//   mixers.forEach((mixer) => {
//     mixer.update(delta);
//   });
// }

// function render() {
//   renderer.render(scene, camera);
// }
