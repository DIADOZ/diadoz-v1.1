/* eslint-disable no-lonely-if */
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
const models = [];
let topLight;
let group;
let selectedObject;
const savedPositions = {};
const tweens = {};

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
const frustumSize = 10;

const xMin = (frustumSize * aspect) / -2;
const xMax = (frustumSize * aspect) / 2;
const zMax = (frustumSize / 2);
const zMin = (frustumSize / -2);

function getRandomPositions() {
  // return [{x,z}] or {x:[],z:[]}
  const positions = { x: [], z: [] };
  for (let i = 0; i < 100; i++) {
    if (Math.random() >= 0.5) {
      if (Math.random() >= 0.5) {
        positions.x.push(getRandomInt(xMin, xMax));
        positions.z.push(zMin);
      } else {
        positions.x.push(getRandomInt(xMin, xMax));
        positions.z.push(zMax);
      }
    } else {
      if (Math.random() >= 0.5) {
        positions.x.push(xMin);
        positions.z.push(getRandomInt(zMin, zMax));
      } else {
        positions.x.push(xMax);
        positions.z.push(getRandomInt(zMin, zMax));
      }
    }
  }

  return positions;
}

function getRandomYPositions() {
  const positions = [];
  for (let i = 0; i < 100; i++) {
    if (Math.random() >= 0.5) {
      positions.push(getRandomInt(-10, -5));
    } else {
      positions.push(getRandomInt(5, 20));
    }
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
  //   75,
  //   aspect,
  //   0.1,
  //   1000,
  // );

  camera.position.y = 30;

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  camera.lookAt( scene.position )
  // createLights();

  group = new THREE.Group();
  loadModels();

  renderer = new THREE.WebGLRenderer({ alpha: 1 });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio);

  container = document.querySelector('#container');
  container.appendChild(renderer.domElement);
  container.addEventListener('click', (event) => {
    event.preventDefault();

    const intersects = getIntersects(event.layerX, event.layerY);
    if (intersects.length > 0) {
      const res = intersects.filter((res) => res && res.object)[0];

      if (res && res.object) {
        selectedObject = res.object;

        TWEEN.remove(tweens[selectedObject.name]);
        selectedObject.position.x = savedPositions[selectedObject.name].x;
        selectedObject.position.z = savedPositions[selectedObject.name].z;
      }
    }
  });

  controls = new OrbitControls(camera, container);


  window.addEventListener('resize', onWindowResize);

  animate();
}

const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector3();

function getIntersects(x, y) {
  x = (x / window.innerWidth) * 2 - 1;
  y = -(y / window.innerHeight) * 2 + 1;

  mouseVector.set(x, y, 0.5);
  raycaster.setFromCamera(mouseVector, camera);

  return raycaster.intersectObject(group, true);
}

function animate(time) {
  requestAnimationFrame(animate);

  // for (const item in models) {
  //   runModel(models[item]);
  // }
  TWEEN.update(time);

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
        savedPositions[item.name] = { x: item.position.x, z: item.position.z };
        // item.castShadow = true;
        item.position.x = getRandomInt(xMin, xMax);
        item.position.z = getRandomInt(zMin, zMax);
        models.push(item);
      }
    }
    for (const item of models) {
      group.add(item);

      const tween = new TWEEN.Tween(item.position)
        .to(getRandomPositions(), 300000)
        .repeat(Infinity)
        .start();

      tweens[item.name] = tween;
    }

    scene.add(group);
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
