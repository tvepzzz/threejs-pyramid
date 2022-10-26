import * as THREE from 'three'
import { OrbitControls } from 'OrbitControls'
import { GLTFLoader } from 'GLTFLoader'
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib'

const init = () => {
	let container = document.querySelector('.container')

	//Scene
	const scene = new THREE.Scene()
	scene.background = new THREE.Color('#E2DFE1')

	//Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		3000
	)
	camera.position.set(1, 5, 3)

	//Render
	const renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(window.innerWidth, window.innerHeight)
	container.appendChild(renderer.domElement)

	let plain
	{
		plain = new THREE.Mesh(
			new THREE.PlaneGeometry(1000, 1000),
			new THREE.MeshBasicMaterial({ color: '#E2DFE1' })
		)
		plain.receiveShadow = true
		plain.position.set(0, -1, 0)
		plain.rotateX(-Math.PI / 2)
		scene.add(plain)
	}

	//Model
	const loader = new GLTFLoader()
	loader.load(
		'../model/scene.gltf',
		gltf => {
			scene.add(gltf.scene)
		},
		function (err) {
			console.warn(err)
		}
	)

	//Light
	const light = new THREE.DirectionalLight(0xffffff, 0.5)
	light.position.set(0, 1, 0)
	light.lookAt(0, 10, 0)
	scene.add(light)

	const secondLight = new THREE.DirectionalLight(0xffffff, 2)
	secondLight.position.set(0, 6, 15)
	secondLight.lookAt(0, 10, 0)
	scene.add(secondLight)

	//Side light

	const sideSecondLight = new THREE.DirectionalLight(0xffffff, 2)
	sideSecondLight.position.set(15, 17, 0)
	sideSecondLight.lookAt(0, 12, 0)
	scene.add(sideSecondLight)

	RectAreaLightUniformsLib.init()

	const rectLight = new THREE.RectAreaLight(0xffffff, 4, 1000, 1000)
	rectLight.position.set(-100, 10, 10)
	rectLight.rotation.y = Math.PI + Math.PI / 5
	scene.add(rectLight)

	//OrbitControls
	const controls = new OrbitControls(camera, renderer.domElement)
	controls.autoRotate = true
	controls.autoRotateSpeed = 4
	controls.enableDamping = true

	//Resize
	window.addEventListener('resize', onWindowResize, false)

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()

		renderer.setSize(window.innerWidth, window.innerHeight)
	}

	const animate = () => {
		requestAnimationFrame(animate)
		controls.update()
		renderer.render(scene, camera)
	}
	animate()
}

init()
