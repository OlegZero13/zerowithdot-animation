import * as THREE from 'three';
import 'three-examples/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import * as dat from 'dat.gui';

import { createReferencePoints, createDataPoints } from './draw';

console.clear();


/* initial */
const container = document.getElementById('threeCanvas');

const scene = new THREE.Scene();
const FOV           = 50;
const ASPECT        = container.offsetWidth/container.offsetHeight;
const NEAR          = 1;
const FAR           = 100;

const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
camera.position.z   = 10;
camera.position.y   = 2;
camera.lookAt(0, 0, 0);

const controls = new THREE.OrbitControls(camera, container);
controls.target.set(0, 5, 0);
controls.update();

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 0.2);
scene.add(light);


/* content */
const dataCentroids     = [];
const dataPointsOrigins = [];
const dataPointsActual  = [];

const gltfloader = new GLTFLoader();
gltfloader.load('./models/ozero-smooth.glb', function (gltf) {
    const ozero         = new THREE.Object3D();
    ozero.position.y    = 4;
    scene.add(ozero);

    const material      = gltf.scene.children[0].material;
    material.metalness  = 0.9;

    const ozero_body    = gltf.scene.children[0];
    const ozero_dot     = gltf.scene.children[1];

    ozero.add(ozero_body);
    ozero.add(ozero_dot);

    const centroidMesh  = new THREE.Object3D();
    ozero.add(centroidMesh);
    dataCentroids.push(centroidMesh);

    const offset = new THREE.Vector3(0.0, 2.5, 0.0);
    let referencePoints = createReferencePoints(ozero.children[0]);
    referencePoints     = referencePoints
        .concat(createReferencePoints(ozero.children[1], offset));
    const actualPoints  = createDataPoints(referencePoints, material);

    referencePoints.forEach((ref, idx) => {
        centroidMesh.add(ref);
        dataPointsOrigins.push(ref);
        
        ref.add(actualPoints[idx]);
        dataPointsActual.push(actualPoints[idx]);
    });

    ozero_body.visible = false;
    ozero_dot.visible = false;

}, undefined, function (error) {
    console.log(error);
});


container.addEventListener("mouseover", enterCanvas, false);
container.addEventListener("mouseout", leaveCanvas, false);

function enterCanvas() {
    for (let i = 0; i <= 12; i++) {
        setTimeout(() => {
            dataPointsActual.forEach((obj) => {
                obj.position.x = obj.position.x/1.5 + 0.1*(Math.random() - 0.5);
                obj.position.y = obj.position.y/1.5 + 0.1*(Math.random() - 0.5);
                obj.position.z = obj.position.z/1.5 + 0.1*(Math.random() - 0.5);
            });
            light.intensity += 0.5;
            renderer.render(scene, camera);
        }, i*50);
    }
}

function leaveCanvas() {
    let px0 = [];
    let py0 = [];
    let pz0 = [];
    dataPointsOrigins.forEach((obj) => {
        px0.push((Math.random() - 0.5) * obj.position.x);
        py0.push((Math.random() - 0.5) * obj.position.y);
        pz0.push((Math.random() - 0.5) * obj.position.z);
    });
    for (let i = 1; i <= 12; i++) {
        setTimeout(() => {
            dataPointsActual.forEach((obj) => {
                obj.position.x *= 1.5;
                obj.position.y *= 1.5;
                obj.position.z *= 1.5;
            });
            light.intensity -= 0.5;
            renderer.render(scene, camera);
        }, 50*i);
    }
}

/* animation - motion */
function render(time) {
    time *= 0.0001;

    dataCentroids.forEach((obj) => {
        obj.rotation.y = time;
    });

    dataPointsActual.forEach((obj) => {
        obj.position.x += 0.01*(Math.random() - 0.5);
        obj.position.y += 0.01*(Math.random() - 0.5);
        obj.position.z += 0.01*(Math.random() - 0.5);
        obj.rotation.x = Math.random()*time;
        obj.rotation.y = time;
        obj.rotation.z = time;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);

