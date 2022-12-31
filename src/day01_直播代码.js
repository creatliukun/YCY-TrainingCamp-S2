import * as THREE from 'three'; // 导入THREEJS的API
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// OrbitControls 轨道控制器，可以使得相机围绕目标进行轨道运动。
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// GLTFLoader GLTF加载器 ，glTF（gl传输格式）是一种开放格式的规范 （open format specification）， 用于更高效地传输、
// 加载3D内容。该类文件以JSON（.gltf）格式或二进制（.glb）格式提供， 外部文件存储贴图（.jpg、.png）和额外的二进制数据（.bin）。
// 一个glTF组件可传输一个或多个场景， 包括网格、材质、贴图、蒙皮、骨架、变形目标、动画、灯光以及摄像机
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// RGBELoader 

let mixer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0.3, 0.3, 0.5);

const controls = new OrbitControls(camera, renderer.domElement);

// scene.background = new THREE.Color(0.6, 0.6, 0.6);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
// scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 0.4);
scene.add(directionLight);

// const boxGeometry = new THREE.BoxGeometry(1,1,1);
// const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(boxMesh);

let donuts;
new GLTFLoader().load('../resources/models/donuts.glb', (gltf) => {

    console.log(gltf);
    scene.add(gltf.scene);
    donuts = gltf.scene;

    // gltf.scene.traverse((child)=>{
    //     console.log(child.name);
    // })

    mixer = new THREE.AnimationMixer(gltf.scene);
    const clips = gltf.animations; // 播放所有动画
    clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.loop = THREE.LoopOnce;
        // 停在最后一帧
        action.clampWhenFinished = true;
        action.play();
    });

})

new RGBELoader()
    .load('../resources/sky.hdr', function (texture) {
        scene.background = texture;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.render(scene, camera);
    });

function animate () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);

    controls.update();

    if (donuts) {
        donuts.rotation.y += 0.01;
    }

    if (mixer) {
        mixer.update(0.02);
    }
}

animate();