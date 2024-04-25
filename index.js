import * as THREE from 'three'
import { OrbitControls } from 'OrbitControls'
import { GLTFLoader } from 'GLTFLoader'
import { RectAreaLightHelper } from 'RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib'

function initNavigation() {
  const links = document.querySelectorAll('.mainMenu a')
  const content = document.querySelector('.content')
  const closeButton = document.querySelector('.closeButton')
  const logo = document.querySelector('.header')

  links.forEach((link) => {
    link.addEventListener('click', () => {
      let linkId = link.href.split('#')[1]
      document.getElementById(linkId).classList.remove('none')
      document.querySelector(`.${linkId}`).classList.add('active')
      content.classList.remove('none')
      logo.classList.add('none')

      closeButton.addEventListener('click', () => {
        document.getElementById(linkId).classList.add('none')
        document.querySelector(`.${linkId}`).classList.remove('active')
        content.classList.add('none')
        logo.classList.remove('none')
      })
    })
  })
}

function initThree() {
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

  camera.position.set(-130, 80, 50)

  //render
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  // renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  // Model
  {
    const loader = new GLTFLoader()
    loader.load(
      './model-narkomfin/scene.gltf',
      (gltf) => {
        scene.add(gltf.scene)
      },
      function (error) {
        console.log('Error: ' + error)
      }
    )
  }
  {
    const light = new THREE.AmbientLight(0xeeeeee) // soft white light (мягкий белый свет)
    scene.add(light)
  }
  {
    const light = new THREE.DirectionalLight(0xeeeeee, 1)
    light.position.set(-2, 0, 10)
    light.lookAt(0, -10, 0)
    scene.add(light)
  }

  {
    const light = new THREE.DirectionalLight(0xeeeeee, 1)
    light.position.set(2, 5, 5)
    light.lookAt(0, 10, 0)
    scene.add(light)
  }

  RectAreaLightUniformsLib.init()
  {
    const rectLight = new THREE.RectAreaLight(0xeeeeee, 1, 1000, 1000)
    rectLight.position.set(-100, 0, 0)
    rectLight.rotation.y = Math.PI + Math.PI / 4
    scene.add(rectLight)
  }

  {
    const rectLight = new THREE.RectAreaLight(0xeeeeee, 1, 1000, 1000)
    rectLight.position.set(100, 0, 0)
    rectLight.rotation.y = Math.PI - Math.PI / 4
    scene.add(rectLight)
  }

  //OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  // controls.autoRotate = true
  controls.autoRotateSpeed = 5
  controls.enableDamping = true
  controls.maxDistance = 200
  controls.maxPolarAngle = Math.PI / 2.1

  //Resize
  window.addEventListener('resize', onWindowResize, false)

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  // Animate
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
}

document.addEventListener('DOMContentLoaded', () => {
  initThree()
  initNavigation()
})
