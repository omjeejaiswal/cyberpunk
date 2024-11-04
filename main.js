import "./style.css"
import * as THREE from 'three';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
// import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import gsap from "gsap";
// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 4;



// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
});


renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25)); // to get performance without sacficing resource
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

let model;

new RGBELoader() 
    .load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', function (texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        //scene.background = envMap; // you can use either remove
        scene.environment = envMap;  // background appear but helmet won't
        texture.dispose();
        pmremGenerator.dispose();
      
        // adding 3d model 
        const loader = new GLTFLoader();
        loader.load('./DamagedHelmet.gltf', (gltf) => {
          model = gltf.scene;
          scene.add(model);
        }, undefined, (error) => {
          console.error('An error occured while loading the GLTF model: ', error);
        });
        
    });

// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true;


window.addEventListener("mousemove", (e) => {
  if(model) {
    const rotationX = (e.clientX / window.innerWidth - .5) * (Math.PI * .25);
    const rotationY = (e.clientY / window.innerHeight - .5) * (Math.PI * .25);
    // model.rotation.y = rotationX;
    // model.rotation.x = rotationY;\
    gsap.to(model.rotation, {
      x: rotationY,
      y: rotationX,
      duration: 0.5,
      ease: "power2.out"
    });
  }
})

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // composer.setSize(window.innerWidth,window.innerHeight)
})

// render
function animate() {
  window.requestAnimationFrame(animate);
  // mesh.rotation.x += 0.02;
  // mesh.rotation.y += 0.02;
  // mesh.rotation.z += 0.02;
  // controls.update();
  renderer.render(scene, camera)
}

// renderer.render(scene, camera);

animate();

