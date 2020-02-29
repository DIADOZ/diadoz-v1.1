/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';

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

const xMin = (frustumSize * aspect) / -2;
const xMax = (frustumSize * aspect) / 2;
const zMax = (frustumSize / 2);
const zMin = (frustumSize / -2);

function getRandomPositions(min, max) {
  const positions = [];
  for (let i = 0; i < 100; i++) {
    positions.push(getRandomInt(min, max));
  }
  return positions;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function start() {
  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(
    xMin,
    xMax,
    zMax,
    zMin,
    0.1,
    1000,
  );

  // new THREE.PerspectiveCamera(
  //   45,
  //   aspect,
  //   0.1,
  //   1000,
  // );

  camera.position.y = 15;

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

  // for (const item in models) {
  //   runModel(models[item]);
  // }
  TWEEN.update();

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
        item.position.x = getRandomInt(xMin, xMax);
        item.position.z = getRandomInt(zMax, zMin);
        models[item.name] = item;
      }
    }
    for (const item in models) {
      scene.add(models[item]);

      new TWEEN.Tween(models[item].position)
        .to({
          x: getRandomPositions(xMin, xMax),
          z: getRandomPositions(zMax, zMin),
        }, 100000)
        .repeat(Infinity)
        .start();
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
  // camera.updateProjectionMatrix();

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}
