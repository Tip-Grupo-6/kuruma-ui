import * as THREE from 'three';

import {useContext, useEffect, useState} from "react";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {RGBELoader} from "three/addons/loaders/RGBELoader";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader";
import {makeStyles} from "@material-ui/core/styles";
import {OIL, TIRE_PRESSURE, WATER} from "../../constants/CarItemConst";
import {MathUtils} from "three";
import {MaintenanceItemContext} from "./CarPage";


let camera, scene, renderer;

let grid;
let controls;

let carModel;
let bodyMaterial, wheelsMaterial, oilMaterial, waterMaterial;


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

    const { maintenanceItemSelected } = useContext(MaintenanceItemContext)
    const classes = styles()

    useEffect(() => {
        const container = document.getElementById('animated-card');
        container.appendChild(init())
        animate(container)
    }, [])

    useEffect(() => {
        if(car) {
            bodyMaterial = new THREE.MeshStandardMaterial({
                color: car.color
            });

            const wheelColor = findMaintenanceItem(TIRE_PRESSURE)?.status_color;
            wheelsMaterial = new THREE.MeshPhysicalMaterial({
                color: wheelColor
            });

            const waterColor = findMaintenanceItem(WATER)?.status_color;
            waterMaterial = new THREE.MeshPhysicalMaterial({
                color: waterColor
            });

            const oilColor = findMaintenanceItem(OIL)?.status_color;
            oilMaterial = new THREE.MeshPhysicalMaterial({
                color: oilColor
            });
        }
    }, [car])

    useEffect(() => {
        if(!carModel) {
            return;
        }
        if(maintenanceItemSelected == null) {
            showHood()
        } else {
            hideHood()
        }
        if(maintenanceItemSelected === WATER || maintenanceItemSelected === OIL) {
            fitCameraTo(carModel.getObjectByName('motor'))
        } else {
            resetCamera()
        }
    }, [maintenanceItemSelected])

    const findMaintenanceItem = (code) => {
        return car.maintenance_values.find(car_item => car_item.code === code);
    }

    const hideHood = () => {
        carModel.getObjectByName('hatch_hood').visible = false
    }

    const showHood = () => {
        carModel.getObjectByName('hatch_hood').visible = true
    }

    const resetCamera = () => {
        const container = document.getElementById('animated-card');
        const parentWidth = container.parentElement.getBoundingClientRect().width
        const parentHeight = container.parentElement.getBoundingClientRect().height
        camera = new THREE.PerspectiveCamera(40, parentWidth / (parentHeight - 200), 0.1, 100);
        camera.position.set(4.25, 1.4, - 4.5);
        camera.updateProjectionMatrix();

        controls = new OrbitControls(camera, container);
        controls.maxDistance = 9;
        controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
        controls.target.set(0, 0.5, 0);
        controls.update();
    }

    const fitCameraTo = (object) => {
        const boundingBox = new THREE.Box3();
        boundingBox.setFromObject(object);
        const objPosition = boundingBox.getCenter(new THREE.Vector3());
        const objSize = boundingBox.getSize(new THREE.Vector3());
        boundingBox.min.y = 0;
        boundingBox.max.y = 0;
        const boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());

        let dim = boundingSphere.radius * 2;
        if (dim < camera.near) {
            dim = camera.near;
        }

        const direction = THREE.Object3D.DEFAULT_UP.clone().clone(); // view direction

        // object angular size
        const fov = MathUtils.degToRad(camera.fov);

        let distance = dim / (2.0 * Math.tan(fov / 2.0)) + 0.5;

        if (camera.aspect <= 1) {
            distance = distance / camera.aspect;
        }

        if (distance < camera.near) {
            distance = objSize.y;
        }

        if (distance < camera.near) {
            distance = camera.near;
        }

        camera.position.copy(objPosition.clone().add(direction.multiplyScalar(distance)));

        if (controls) {
            let axis = new THREE.Vector3( 1, 0, 0);
            let angle = 200;
            objPosition.applyAxisAngle(axis, angle);
            controls.target.copy(objPosition);
            // controls.rotateLeft(Math.PI);
        } else {
            camera.lookAt(objPosition);
        }

        camera.updateProjectionMatrix();
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
        const defaultTransparentMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
        });
        bodyMaterial = defaultTransparentMaterial
        wheelsMaterial = defaultTransparentMaterial
        oilMaterial = defaultTransparentMaterial
        waterMaterial = defaultTransparentMaterial

        // Car
        const shadow = new THREE.TextureLoader().load('/threejs/models/gltf/ferrari_ao.png');

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/threejs/jsm/draco/gltf/libs/');

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        // loader.load('/threejs/models/gltf/ferrari.glb', function (gltf) {
        loader.load('/threejs/models/gltf/scene.glb', function (gltf) {

            carModel = gltf.scene.children[ 0 ];

            carModel.getObjectByName('body__prim_env_4_spec_-material').material = bodyMaterial
            carModel.getObjectByName('body__prim_env_4_spec_-material_1').material = bodyMaterial
            carModel.getObjectByName('body__prim_env_4_spec_-material_2').material = bodyMaterial
            carModel.getObjectByName('body__prim_env_4_spec_-material_3').material = bodyMaterial
            carModel.getObjectByName('body__prim_env_4_spec_-material_4').material = bodyMaterial
            carModel.getObjectByName('body__prim_env_4_spec_-material_5').material = bodyMaterial
            carModel.getObjectByName('body__prim_env_4_spec_-material_6').material = bodyMaterial
            carModel.getObjectByName('body__prim_env_4_spec_-material_7').material = bodyMaterial
            carModel.getObjectByName('body__prim_env_4_spec_-material_8').material = bodyMaterial

            carModel.getObjectByName('water').children
                .find(c => c.name === 'water_tank')
                .material = waterMaterial;

            carModel.getObjectByName('oil').children
                .find(c => c.name === 'oil_tank')
                .material = oilMaterial;

            carModel.getObjectByName('wheel_rf').children.forEach(children => children.material = wheelsMaterial);
            carModel.getObjectByName('wheel_rb').children.forEach(children => children.material = wheelsMaterial);
            carModel.getObjectByName('wheel_lf').children.forEach(children => children.material = wheelsMaterial);
            carModel.getObjectByName('wheel_lb').children.forEach(children => children.material = wheelsMaterial);

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
        renderer.render(scene, camera);
    }


    return (
        <div id={"animated-card"} className={classes.animatedCard} ></div>
   )
}
