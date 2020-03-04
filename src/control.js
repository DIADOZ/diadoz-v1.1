/* eslint-disable no-lonely-if */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';
import { fadeIn } from './index';

let container;
let camera;
let controls;
let renderer;
let scene;
const models = [];
let topLight;
let modelGroup;
let selectedObject;
let savedPositions = {};
const tweens = {};

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
const frustumSize = 10;

const xMin = (frustumSize * aspect) / -2;
const xMax = (frustumSize * aspect) / 2;
const zMax = (frustumSize / 2);
const zMin = (frustumSize / -2);


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

  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
  camera.lookAt(scene.position);
  
  // createLights();

  modelGroup = new THREE.Group();
  loadModels();

  renderer = new THREE.WebGLRenderer({ alpha: 1 });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio);

  container = document.querySelector('#container');
  container.appendChild(renderer.domElement);
  container.addEventListener('click', snapModel);

  controls = new OrbitControls(camera, container);

  window.addEventListener('resize', onWindowResize);

  animate();
}



function loadModels() {
  const loader = new GLTFLoader();

  // A reusable function to set up the models. Position parameter to move model
  const onLoad = (gltf) => {
    if (gltf.scene) {
      for (let i = gltf.scene.children.length - 1; i >= 0; i--) {
        const model = gltf.scene.children[i];
        savedPositions = { x: model.position.x, z: model.position.z };
        // item.castShadow = true;

        modelGroup.add(model);

        const tween1 = new TWEEN.Tween(model.position)
          .to(getRandomPositions(), 300000)
          .repeat(Infinity)
          .onStop(transitionModel)
          .start();

        // const tween2 = new TWEEN.Tween(model.position)
        //   .to(getLockedPositions(), 300000)
        //   .onStop(transitionPage);

        models.push({
          model,
          savedPositions,
          tween1,
          // tween2,
        });
        tweens[model.name] = tween1;
      }
    }

    scene.add(modelGroup);
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

function transitionModel() {
  if (TWEEN.getAll().length === 0) {
    for (const modelObj of models) {
      modelObj.tween2.start();
    }
  }
}

function transitionPage() {
  // call fade in
}

function animate(time) {
  requestAnimationFrame(animate);

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

function snapModel(event) {
  event.preventDefault();

  const intersects = getIntersects(event.layerX, event.layerY);
  if (intersects.length > 0) {
    const res = intersects.filter((res) => res && res.object)[0];

    if (res && res.object) {
      const modelObj = models.find((obj) => obj.model.name === res.object.name);

      modelObj.tween.stop();
      modelObj.model.position.x = modelObj.savedPositions.x;
      modelObj.model.position.z = modelObj.savedPositions.z;
    }
  }
}

const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector3();

function getIntersects(x, y) {
  x = (x / window.innerWidth) * 2 - 1;
  y = -(y / window.innerHeight) * 2 + 1;

  mouseVector.set(x, y, 0.5);
  raycaster.setFromCamera(mouseVector, camera);

  return raycaster.intersectObject(modelGroup, true);
}

function onWindowResize() {
  camera.aspect = aspect;

  // update the camera's frustum
  // camera.updateProjectionMatrix();

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}

function getLockedPositions() {
  // take saved positions and return same except lower down
  const positions = { x: [], z: [] };
}

function getRandomPositions() {
  // return [{x,z}] or {x:[],z:[]}
  const positions = { x: [], z: [] };
  for (let i = 0; i < 100; i++) {
    if (Math.random() >= 0.5) {
      if (Math.random() >= 0.5) {
        positions.x.push(getRandomInt(xMin, xMax));
        positions.z.push(zMin + 0.5);
      } else {
        positions.x.push(getRandomInt(xMin, xMax));
        positions.z.push(zMax - 0.5);
      }
    } else {
      if (Math.random() >= 0.5) {
        positions.x.push(xMin + 2);
        positions.z.push(getRandomInt(zMin, zMax));
      } else {
        positions.x.push(xMax - 2);
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
