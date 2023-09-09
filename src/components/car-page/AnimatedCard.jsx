import * as THREE from 'three';

import {useEffect, useState} from "react";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {RGBELoader} from "three/addons/loaders/RGBELoader";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader";
import {makeStyles} from "@material-ui/core/styles";


let camera, scene, renderer;

let grid;
let controls;

const wheels = [];

let carModel;
let bodyMaterial, detailsMaterial, glassMaterial, wheelsMaterial;

const wheelsLeft = ['wheel_fl', 'wheel_rl']
const wheelsRigth = ['wheel_fr', 'wheel_rr']


const styles = makeStyles(theme => ({
    animatedCard: {
        display: "flex",
        justifyContent: "center",

        '& canvas': {
            // width: "100%",
            height: "410px !important",

            [theme.breakpoints.up("sm")]: {
                height: "auto !important",
            }
        }
    }
}))

export const AnimatedCard = ({car}) => {

    const [move, setMove] = useState(false)
    const classes = styles()

    useEffect(() => {
        const container = document.getElementById('animated-card');
        container.appendChild(init())
        animate(container)
    }, [])

    useEffect(() => {
        if(car) {
            bodyMaterial = new THREE.MeshPhysicalMaterial({
                color: car.color?.toLowerCase(), metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03
            });

            const wheelColor = !car.maintenance_values.tire_pressure_check_due ? "green" : "red";
            wheelsMaterial = new THREE.MeshPhysicalMaterial({
                color: wheelColor, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03
            });
        }
    }, [car])

    const moveWheels = () => {
        if(move) {
            wheelsMaterial.color.set(0xffffff)
            wheelsLeft.forEach(wheelName => {
                carModel?.getObjectByName(wheelName).translateX(0.25)
            });
            wheelsRigth.forEach(wheelName => {
                carModel?.getObjectByName(wheelName).translateX(-0.25)
            })
        } else {
            const wheelColor = car
                ?(!car.maintenance_values?.tire_pressure_check_due ? "green" : "red")
                : 0xffffff;
            wheelsMaterial.color.set(wheelColor)
            wheelsLeft.forEach(wheelName => {
                carModel?.getObjectByName(wheelName).translateX(-0.25)
            });
            wheelsRigth.forEach(wheelName => {
                carModel?.getObjectByName(wheelName).translateX(0.25)
            })
        }
        setMove(prevState => !prevState)
    }

    const init = () => {

        const container = document.getElementById('animated-card');
        const parentWidth = container.parentElement.getBoundingClientRect().width
        const parentHeight = container.parentElement.getBoundingClientRect().height

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(parentWidth - 50, parentHeight - 50);
        renderer.setAnimationLoop(render);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.85;

        window.addEventListener('resize', onWindowResize);

        camera = new THREE.PerspectiveCamera(40, parentWidth / (parentHeight - 200), 0.1, 100);
        camera.position.set(4.25, 1.4, - 4.5);

        return renderer.domElement
    }

    const animate = (container) => {
        controls = new OrbitControls(camera, container);
        controls.maxDistance = 9;
        controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
        controls.target.set(0, 0.5, 0);
        controls.update();

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333);
        scene.environment = new RGBELoader().load('/threejs/textures/equirectangular/venice_sunset_1k.hdr');
        scene.environment.mapping = THREE.EquirectangularReflectionMapping;
        scene.fog = new THREE.Fog(0x333333, 10, 15);

        grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
        grid.material.opacity = 0.2;
        grid.material.depthWrite = false;
        grid.material.transparent = true;
        scene.add(grid);

        // materials

        bodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
        });

        wheelsMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
        });

        detailsMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff, metalness: 1.0, roughness: 0.5
        });

        glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
        });

        // Car
        const shadow = new THREE.TextureLoader().load('/threejs/models/gltf/ferrari_ao.png');

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/threejs/jsm/draco/gltf/libs/');

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        loader.load('/threejs/models/gltf/ferrari.glb', function (gltf) {

            carModel = gltf.scene.children[ 0 ];

            carModel.getObjectByName('body').material = bodyMaterial;

            carModel.getObjectByName('rim_fl').material = wheelsMaterial;
            carModel.getObjectByName('rim_fr').material = wheelsMaterial;
            carModel.getObjectByName('rim_rr').material = wheelsMaterial;
            carModel.getObjectByName('rim_rl').material = wheelsMaterial;
            carModel.getObjectByName('trim').material = wheelsMaterial;

            carModel.getObjectByName('glass').material = glassMaterial;

            carModel.getObjectByName('wheel').material = wheelsMaterial;
            carModel.getObjectByName('wheel_1').material = wheelsMaterial;
            carModel.getObjectByName('wheel_2').material = wheelsMaterial;
            carModel.getObjectByName('wheel_3').material = wheelsMaterial;


            wheels.push(
                carModel.getObjectByName('wheel_fl'),
                carModel.getObjectByName('wheel_fr'),
                carModel.getObjectByName('wheel_rl'),
                carModel.getObjectByName('wheel_rr')
           );

            // shadow
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
                new THREE.MeshBasicMaterial({
                    map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
                })
           );
            mesh.rotation.x = - Math.PI / 2;
            mesh.renderOrder = 2;
            carModel.add(mesh);

            scene.add(carModel);
        });
    }

    function onWindowResize() {
        const container = document.getElementById('animated-card')
        const parentWidth = container.parentElement.getBoundingClientRect().width
        const parentHeight = container.parentElement.getBoundingClientRect().height

        camera.aspect = parentWidth / (parentHeight - 200);
        camera.updateProjectionMatrix();
        renderer.setSize(parentWidth - 50, parentHeight - 50);
    }

    function render() {
        controls.update();
        const time = - performance.now() / 1000;
        for (let i = 0; i < wheels.length; i ++) {
            wheels[ i ].rotation.x = time * Math.PI * 2;
        }
        grid.position.z = - (time) % 1;
        renderer.render(scene, camera);
    }


    return (
        <div id={"animated-card"} className={classes.animatedCard} ></div>
   )
}
