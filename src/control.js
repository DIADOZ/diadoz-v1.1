import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';
import { fadeIn } from './index';

let container;
let camera;
let renderer;
let scene;
const models = [];
let modelGroup;
let savedPositions = {};

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
const frustumSize = 10;

const xMin = (frustumSize * aspect) / -2;
const xMax = (frustumSize * aspect) / 2;
const zMax = frustumSize / 2;
const zMin = frustumSize / -2;

export function start() {
  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(xMin, xMax, zMax, zMin, 0.1, 1000);

  // new THREE.PerspectiveCamera(
  //   75,
  //   aspect,
  //   0.1,
  //   1000,
  // );

  camera.position.y = 30;
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer({ alpha: 1 });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio);

  container = document.querySelector('#container');
  container.appendChild(renderer.domElement);
  container.addEventListener('click', snapModel);

  modelGroup = new THREE.Group();
  loadModels();

  window.addEventListener('resize', onWindowResize);

  animate();
}

function loadModels() {
  const loader = new GLTFLoader();

  // A reusable function to set up the models. Position parameter to move model
  const onLoad = gltf => {
    if (gltf.scene) {
      for (let i = gltf.scene.children.length - 1; i >= 0; i--) {
        const model = gltf.scene.children[i];
        savedPositions = { x: model.position.x, z: model.position.z };
        // item.castShadow = true;

        modelGroup.add(model);

        models.push({
          model,
          savedPositions
        });
      }
    }
    scene.add(modelGroup);
    createTweens();
    startTween('tween1');
  };
  const onProgress = xhr => {
    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
  };
  const onError = errorMessage => {
    console.log(errorMessage);
  };

  // model is loaded asynchronously,
  loader.load(
    './assets/model/diadoz-official-blender.glb',
    gltf => onLoad(gltf),
    onProgress,
    onError
  );
}

function createTweens() {
  models.forEach(modelObj => {
    const tween1 = new TWEEN.Tween(modelObj.model.position)
      .to(getRandomPositions(), 400000)
      .repeat(Infinity)
      .onStop(transitionModel);

    const tween2 = new TWEEN.Tween(modelObj.model.position)
      .to(getLockedPositions(modelObj.savedPositions), 1000)
      .onComplete(transitionPage);

    modelObj.tween1 = tween1;
    modelObj.tween2 = tween2;
  });
}

function startTween(tweenType) {
  models.forEach(modelObj => {
    modelObj[tweenType].start();
  });
}

function transitionModel() {
  if (TWEEN.getAll().length === 0) {
    startTween('tween2');
  }
}

function transitionPage() {
  new OrbitControls(camera, container);
  fadeIn();
}

function snapModel(event) {
  event.preventDefault();

  const intersects = getIntersects(event.layerX, event.layerY);
  if (intersects.length > 0) {
    const res = intersects.filter(res => res && res.object)[0];

    if (res && res.object) {
      const modelObj = models.find(obj => obj.model.name === res.object.name);

      modelObj.model.position.x = modelObj.savedPositions.x;
      modelObj.model.position.z = modelObj.savedPositions.z;
      modelObj.tween1.stop();
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

function animate(time) {
  requestAnimationFrame(animate);

  TWEEN.update(time);

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = aspect;

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}

function getLockedPositions(centerPosition) {
  const position = {
    z: centerPosition.z + 1
  };

  return position;
}

function getRandomPositions() {
  // return [{x,z}] or {x:[],z:[]}
  const positions = { x: [], z: [] };
  const xMaxAdjusted = xMax - 0.7;
  const xMinAdjusted = xMin + 0.7;
  const zMaxAdjusted = zMax - 0.5;
  const zMinAdjusted = zMin + 0.5;
  for (let i = 0; i < 100; i++) {
    if (Math.random() >= 0.5) {
      if (Math.random() >= 0.5) {
        positions.x.push(getRandomInt(xMinAdjusted, xMaxAdjusted));
        positions.z.push(zMinAdjusted);
      } else {
        positions.x.push(getRandomInt(xMinAdjusted, xMaxAdjusted));
        positions.z.push(zMaxAdjusted);
      }
    } else {
      if (Math.random() >= 0.5) {
        positions.x.push(xMinAdjusted);
        positions.z.push(getRandomInt(zMinAdjusted, zMaxAdjusted));
      } else {
        positions.x.push(xMaxAdjusted);
        positions.z.push(getRandomInt(zMinAdjusted, zMaxAdjusted));
      }
    }
  }

  return positions;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
