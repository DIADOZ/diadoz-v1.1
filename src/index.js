import 'normalize.css';
import './index.css';

// import "../app/init";
// import './autoplay';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let container;
let camera;
let controls;
let renderer;
let scene;
let model;
let topLight, bottomLight;

const mixers = [];
const clock = new THREE.Clock();

function init() {
  container = document.querySelector("#scene-container");

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

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.x = -2;
  camera.position.y = 1.8;
  camera.position.z = 0;
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(0xfffff0, 5);

  topLight = new THREE.PointLight(0xcd712c, 5, 100, 2);
  topLight.castShadow = true;
  topLight.position.x = 0;
  topLight.position.y = 1;
  topLight.position.z = 0;

  bottomLight = new THREE.PointLight(0xcd712c, 1, 100, 2);
  bottomLight.castShadow = true;

  scene.add(ambientLight, topLight, bottomLight);
}

function loadModels() {
  const loader = new GLTFLoader();

  // A reusable function to set up the models. Position parameter to move model
  const onLoad = (gltf, position) => {
    model = gltf.scene.children[2];
    model.position.copy(position);
    model.castShadow = true;

    scene.add(model);
  };

  const onProgress = () => {};
  const onError = errorMessage => {
    console.log(errorMessage);
  };

  // model is loaded asynchronously,
  const atlasPosition = new THREE.Vector3(0, 0, 0);
  loader.load(
    "./asset/model/diadoz-logo.glb",
    gltf => onLoad(gltf, atlasPosition),
    onProgress,
    onError
  );
}

function createControls() {
  controls = new OrbitControls(camera, container);
//   controls.autoRotate = true;
//   controls.autoRotateSpeed = 2;
//   controls.enableZoom = false;
//   controls.enableKeys = false;
//   controls.enablePan = false;
  // controls.maxPolarAngle = 1.6;
}

function createRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({ });
//   renderer.setClearColor(new THREE.Color(0xff0000));
//   renderer.setClearAlpha(0);
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  container.appendChild(renderer.domElement);
}

function update() {
  const delta = clock.getDelta();
  var time = Date.now() * 0.0005;

  bottomLight.position.x = (Math.sin(time * 0.7) * 20) / 100;
  bottomLight.position.y = -0.5;
  bottomLight.position.z = (Math.cos(time * 0.3) * 30) / 100;

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

window.addEventListener("resize", onWindowResize);

init();