import '@fortawesome/fontawesome-free/js/fontawesome';
// import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/brands';
import 'normalize.css';
import './index.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let container;
let camera;
let controls;
let renderer;
let scene;
let model;
let topLight;

const mixers = [];
export const clock = new THREE.Clock();

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.x = 0;
  camera.position.y = 15;
  camera.position.z = 0;
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(0xfffff0, 5);

  topLight = new THREE.PointLight(0xcd712c, 5, 10, 2);
  topLight.castShadow = false;
  topLight.position.x = 0;
  topLight.position.y = 15;
  topLight.position.z = 0;

  scene.add(ambientLight, topLight);
}

function loadModels() {
  const loader = new GLTFLoader();

  // A reusable function to set up the models. Position parameter to move model
  const onLoad = (gltf, position) => {
    // console.log(dumpObject(gltf.scene).join('\n'));
    model = gltf.scene.children[0];
    model.position.copy(position);
    model.castShadow = true;

    scene.add(model);
  };

  const onProgress = () => {};
  const onError = (errorMessage) => {
    console.log(errorMessage);
  };

  // model is loaded asynchronously,
  const atlasPosition = new THREE.Vector3(0.02, 0, 0);
  loader.load(
    './assets/model/diadoz-logo.glb',
    (gltf) => onLoad(gltf, atlasPosition),
    onProgress,
    onError,
  );
}

function createControls() {
  controls = new OrbitControls(camera, container);
  // controls.autoRotate = true;
  // controls.autoRotateSpeed = 2;
  controls.enableZoom = false;
  controls.enableKeys = false;
  controls.enablePan = false;
  controls.maxPolarAngle = 1.6;
}

function createRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({ canvas: container, alpha: 1 });
  renderer.setClearColor(new THREE.Color(0xff0000));
  renderer.setClearAlpha(0);
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
}

function update() {
  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

export function start() {
  container = document.querySelector('#scene');

  scene = new THREE.Scene();

  createCamera();
  createLights();
  loadModels();
  createControls();
  createRenderer();

  renderer.setAnimationLoop(() => {
    controls.update();
    update();
    render();
  });
}

window.addEventListener('resize', onWindowResize);