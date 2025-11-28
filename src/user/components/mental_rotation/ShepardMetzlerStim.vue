<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as THREE from 'three'

/**
 * ShepardMetzlerStim - Renders a 3D Shepard-Metzler mental rotation stimulus
 *
 * Config string format: "L1D1-L2D2-L3D3-L4D4"
 * where:
 *   Ln = length of segment n (2, 3, or 4 cubes)
 *   Dn = direction/attachment of segment n relative to previous
 *        For segment 1: starting direction (X+, X-, Y+, Y-, Z+, Z-)
 *        For segments 2-4: turn direction (U, D, L, R, F, B)
 *          U=up, D=down, L=left, R=right, F=forward, B=back
 *          (perpendicular to current direction)
 *
 * Examples:
 *   "3X+-2U-4L-3D" = 3 cubes going +X, turn up for 2, turn left for 4, turn down for 3
 *   "2Y+-3R-2F-4L" = 2 cubes going +Y, turn right for 3, turn forward for 2, turn left for 4
 */

const props = defineProps({
  config: {
    type: String,
    required: true,
    validator: (value) => {
      // Validate format: L1D1-L2D2-L3D3-L4D4
      const pattern = /^[234][XYZ][+-]-[234][UDLRFB]-[234][UDLRFB]-[234][UDLRFB]$/
      return pattern.test(value)
    },
  },
  width: {
    type: Number,
    default: 300,
  },
  height: {
    type: Number,
    default: 300,
  },
  rotationX: {
    type: Number,
    default: 0.5,
  },
  rotationY: {
    type: Number,
    default: 0.5,
  },
  rotationZ: {
    type: Number,
    default: 0,
  },
  cubeColor: {
    type: String,
    default: '#888888',
  },
  edgeColor: {
    type: String,
    default: '#333333',
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
  mirror: {
    type: Boolean,
    default: false,
  },
})

const containerRef = ref(null)
let scene, camera, renderer, figureGroup

// Direction vectors for initial segment
const directionVectors = {
  'X+': new THREE.Vector3(1, 0, 0),
  'X-': new THREE.Vector3(-1, 0, 0),
  'Y+': new THREE.Vector3(0, 1, 0),
  'Y-': new THREE.Vector3(0, -1, 0),
  'Z+': new THREE.Vector3(0, 0, 1),
  'Z-': new THREE.Vector3(0, 0, -1),
}

// Get perpendicular turn direction based on current direction
function getTurnVector(currentDir, turn) {
  // Normalize current direction
  const curr = currentDir.clone().normalize()

  // Define turn mappings based on current travel direction
  // U=up (+Y), D=down (-Y), L=left (-X), R=right (+X), F=forward (+Z), B=back (-Z)
  // These are relative to a standard view, but we need them perpendicular to current direction

  const turnVectors = {
    U: new THREE.Vector3(0, 1, 0),
    D: new THREE.Vector3(0, -1, 0),
    L: new THREE.Vector3(-1, 0, 0),
    R: new THREE.Vector3(1, 0, 0),
    F: new THREE.Vector3(0, 0, 1),
    B: new THREE.Vector3(0, 0, -1),
  }

  let turnVec = turnVectors[turn]

  // If the turn vector is parallel to current direction, we need to pick a different one
  if (Math.abs(curr.dot(turnVec)) > 0.9) {
    // Pick a perpendicular direction
    if (Math.abs(curr.y) < 0.9) {
      turnVec = turn === 'U' || turn === 'R' || turn === 'F' ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, -1, 0)
    } else {
      turnVec = turn === 'U' || turn === 'R' || turn === 'F' ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(-1, 0, 0)
    }
  }

  return turnVec
}

// Parse config string into segments
function parseConfig(config) {
  // Handle the first segment specially since it may contain a minus sign
  // Format: "3X+-2U-4L-3D" or "3X--2U-4L-3D"
  // First segment is always 3 chars: length + axis + sign
  const firstSeg = config.substring(0, 3)
  const rest = config.substring(4) // Skip the first segment and its trailing dash

  const segments = []

  // Parse first segment: length + axis + sign (e.g., "3X+" or "3X-")
  const length1 = parseInt(firstSeg[0])
  const axis = firstSeg[1]
  const sign = firstSeg[2]
  const key = axis + sign
  const dirVec = directionVectors[key]
  if (!dirVec) {
    console.error(`Invalid direction key: ${key} from config: ${config}`)
    segments.push({
      length: length1,
      direction: directionVectors['X+'].clone(),
    })
  } else {
    segments.push({
      length: length1,
      direction: dirVec.clone(),
    })
  }

  // Parse remaining segments (e.g., "2U-4L-3D")
  const remainingParts = rest.split('-')
  for (const part of remainingParts) {
    if (part.length >= 2) {
      const length = parseInt(part[0])
      const turn = part[1]
      segments.push({
        length,
        turn,
      })
    }
  }

  return segments
}

// Create a single cube with edges
function createCube(position, color, edgeColor) {
  const group = new THREE.Group()

  // Cube geometry - slightly smaller than 1 to show gaps
  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95)
  const material = new THREE.MeshLambertMaterial({ color })
  const cube = new THREE.Mesh(geometry, material)
  group.add(cube)

  // Edge lines
  const edgesGeometry = new THREE.EdgesGeometry(geometry)
  const edgesMaterial = new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 })
  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
  group.add(edges)

  group.position.copy(position)
  return group
}

// Build the complete figure from segments
function buildFigure(segments, cubeColor, edgeColor) {
  const group = new THREE.Group()
  const positions = new Set()
  let currentPos = new THREE.Vector3(0, 0, 0)
  let currentDir = segments[0].direction.clone()

  for (let segIndex = 0; segIndex < segments.length; segIndex++) {
    const segment = segments[segIndex]

    // For segments after the first, calculate new direction
    if (segIndex > 0) {
      currentDir = getTurnVector(currentDir, segment.turn)
    }

    // Add cubes for this segment
    for (let i = 0; i < segment.length; i++) {
      const posKey = `${currentPos.x.toFixed(2)},${currentPos.y.toFixed(2)},${currentPos.z.toFixed(2)}`

      // Only add cube if position is not already occupied
      if (!positions.has(posKey)) {
        positions.add(posKey)
        const cube = createCube(currentPos.clone(), cubeColor, edgeColor)
        group.add(cube)
      }

      // Move to next position (except for last cube of last segment)
      if (i < segment.length - 1 || segIndex < segments.length - 1) {
        currentPos.add(currentDir)
      }
    }
  }

  // Center the figure
  const box = new THREE.Box3().setFromObject(group)
  const center = box.getCenter(new THREE.Vector3())
  group.children.forEach((child) => {
    child.position.sub(center)
  })

  return group
}

function initScene() {
  if (!containerRef.value) return

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(props.backgroundColor)

  // Camera - orthographic for cleaner look
  const aspect = props.width / props.height
  const frustumSize = 10
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000
  )
  camera.position.set(10, 10, 10)
  camera.lookAt(0, 0, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(props.width, props.height)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)

  // Lighting - brighter ambient to keep whites looking white
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
  scene.add(ambientLight)

  // Main light from upper front
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(5, 10, 7)
  scene.add(directionalLight)

  // Fill light from the opposite side to reduce dark shadows
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
  fillLight.position.set(-5, 5, -5)
  scene.add(fillLight)

  // Bottom fill to lighten undersides
  const bottomLight = new THREE.DirectionalLight(0xffffff, 0.3)
  bottomLight.position.set(0, -10, 0)
  scene.add(bottomLight)

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
  directionalLight2.position.set(-5, -5, -5)
  scene.add(directionalLight2)

  // Build figure
  buildAndRenderFigure()
}

function buildAndRenderFigure() {
  // Remove old figure if exists
  if (figureGroup) {
    scene.remove(figureGroup)
    figureGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose()
      if (child.material) child.material.dispose()
    })
  }

  // Parse config and build
  const segments = parseConfig(props.config)
  figureGroup = buildFigure(segments, props.cubeColor, props.edgeColor)

  // Apply mirror if enabled (flip on X axis)
  if (props.mirror) {
    figureGroup.scale.x = -1
  }

  // Apply rotation
  figureGroup.rotation.x = props.rotationX
  figureGroup.rotation.y = props.rotationY
  figureGroup.rotation.z = props.rotationZ

  scene.add(figureGroup)
  renderer.render(scene, camera)
}

function render() {
  if (!renderer || !scene || !camera) return

  if (figureGroup) {
    figureGroup.rotation.x = props.rotationX
    figureGroup.rotation.y = props.rotationY
    figureGroup.rotation.z = props.rotationZ
  }

  renderer.render(scene, camera)
}

function cleanup() {
  if (renderer) {
    renderer.dispose()
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement)
    }
  }
  if (figureGroup) {
    figureGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose()
      if (child.material) child.material.dispose()
    })
  }
}

// Watch for prop changes
watch(
  () => props.config,
  () => {
    if (scene) buildAndRenderFigure()
  }
)

watch([() => props.rotationX, () => props.rotationY, () => props.rotationZ], () => {
  render()
})

watch(
  () => props.backgroundColor,
  (newColor) => {
    if (scene) {
      scene.background = new THREE.Color(newColor)
      render()
    }
  }
)

watch([() => props.cubeColor, () => props.edgeColor, () => props.mirror], () => {
  if (scene) buildAndRenderFigure()
})

watch([() => props.width, () => props.height], () => {
  if (renderer && camera) {
    const aspect = props.width / props.height
    const frustumSize = 10
    camera.left = (frustumSize * aspect) / -2
    camera.right = (frustumSize * aspect) / 2
    camera.top = frustumSize / 2
    camera.bottom = frustumSize / -2
    camera.updateProjectionMatrix()
    renderer.setSize(props.width, props.height)
    render()
  }
})

onMounted(() => {
  initScene()
})

onUnmounted(() => {
  cleanup()
})

// Expose method to get current configuration
defineExpose({
  getConfig: () => props.config,
  render,
})
</script>

<template>
  <div
    class="shepard-metzler-wrapper"
    :style="{
      width: width + 'px',
      height: height + 'px',
      backgroundColor: backgroundColor,
    }"
  >
    <div ref="containerRef" class="shepard-metzler-stim"></div>
  </div>
</template>

<style scoped>
.shepard-metzler-wrapper {
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
}

.shepard-metzler-stim {
  width: 100%;
  height: 100%;
}
</style>
