<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import useViewAPI from '@/core/composables/useViewAPI'
import { Button } from '@/uikit/components/ui/button'
import { ConstrainedTaskWindow } from '@/uikit/layouts'
import ShepardMetzlerStim from './ShepardMetzlerStim.vue'

const api = useViewAPI()

// Configure the instruction steps
api.steps.append([{ id: 'same_objects' }, { id: 'different_objects' }, { id: 'response_keys' }])

// Demo stimulus config
const demoConfig = '2Z+-3B-2U-4F'

// Animation state for page 1 (same objects)
const animationPhase = ref('initial') // 'initial', 'rotating', 'sliding', 'aligned', 'reset'
const page1AnimationCycles = ref(0) // Track how many times animation has looped
const leftRotationX = ref(0.5)
const leftRotationY = ref(0.5)
const rightRotationX = ref(0.5)
const rightRotationY = ref(2.0) // Start rotated differently
const rightPositionX = ref(0) // For sliding animation
const rightOpacity = ref(1.0) // Opacity for sliding animation

// Animation state for page 2 (mirror/different)
// Phase: 'initial', 'rotating', 'sliding', 'shaking', 'reset'
const mirrorAnimationPhase = ref('initial')
const page2AnimationCycles = ref(0) // Track how many times animation has looped
const mirrorAttempt = ref(1) // Track which rotation attempt we're on
const mirrorLeftRotationY = ref(0.5)
const mirrorRightRotationX = ref(0.5)
const mirrorRightRotationY = ref(2.0)
const mirrorRightRotationZ = ref(0)
const mirrorRightPositionX = ref(0) // For sliding animation
const mirrorRightOpacity = ref(1.0) // Opacity for sliding animation
const mirrorShakeX = ref(0)

// Animation timing constants
const ROTATION_DURATION = 2000
const SLIDE_DURATION = 1500
const PAUSE_DURATION = 1500
const SHAKE_DURATION = 1000

let animationFrameId = null
let animationStartTime = 0

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function resetPage1Animation() {
  animationPhase.value = 'initial'
  page1AnimationCycles.value = 0
  rightPositionX.value = 0
  rightOpacity.value = 1.0
  rightRotationY.value = 2.0
  animationStartTime = 0
}

function resetPage2Animation() {
  mirrorAnimationPhase.value = 'initial'
  page2AnimationCycles.value = 0
  mirrorAttempt.value = 1
  mirrorRightPositionX.value = 0
  mirrorRightOpacity.value = 1.0
  mirrorRightRotationX.value = 0.5
  mirrorRightRotationY.value = 2.0
  mirrorRightRotationZ.value = 0
  mirrorShakeX.value = 0
  animationStartTime = 0
}

function animate(timestamp) {
  if (!animationStartTime) animationStartTime = timestamp
  const elapsed = timestamp - animationStartTime

  if (api.pathString === 'same_objects') {
    // Page 1: Same objects animation
    if (animationPhase.value === 'initial') {
      if (elapsed > 500) {
        animationPhase.value = 'rotating'
        animationStartTime = timestamp
      }
    } else if (animationPhase.value === 'rotating') {
      const progress = Math.min(elapsed / ROTATION_DURATION, 1)
      const eased = easeInOutCubic(progress)
      rightRotationY.value = 2.0 + (0.5 - 2.0) * eased

      if (progress >= 1) {
        animationPhase.value = 'sliding'
        animationStartTime = timestamp
      }
    } else if (animationPhase.value === 'sliding') {
      const progress = Math.min(elapsed / SLIDE_DURATION, 1)
      const eased = easeInOutCubic(progress)
      rightPositionX.value = -216 * eased
      // Fade to 50% opacity as it slides over
      rightOpacity.value = 1.0 - 0.5 * eased

      if (progress >= 1) {
        animationPhase.value = 'aligned'
        animationStartTime = timestamp
      }
    } else if (animationPhase.value === 'aligned') {
      if (elapsed > PAUSE_DURATION) {
        animationPhase.value = 'reset'
        animationStartTime = timestamp
      }
    } else if (animationPhase.value === 'reset') {
      const progress = Math.min(elapsed / 800, 1)
      const eased = easeInOutCubic(progress)
      rightRotationY.value = 0.5 + (2.0 - 0.5) * eased
      rightPositionX.value = -216 * (1 - eased)
      // Fade back to full opacity
      rightOpacity.value = 0.5 + 0.5 * eased

      if (progress >= 1) {
        animationPhase.value = 'initial'
        page1AnimationCycles.value++
        animationStartTime = timestamp
      }
    }
  } else if (api.pathString === 'different_objects') {
    // Page 2: Different objects (mirror) animation - tries two different rotations
    if (mirrorAnimationPhase.value === 'initial') {
      if (elapsed > 500) {
        mirrorAnimationPhase.value = 'rotating'
        animationStartTime = timestamp
      }
    } else if (mirrorAnimationPhase.value === 'rotating') {
      const progress = Math.min(elapsed / ROTATION_DURATION, 1)
      const eased = easeInOutCubic(progress)

      if (mirrorAttempt.value === 1) {
        // First attempt: rotate on Y axis
        mirrorRightRotationY.value = 2.0 + (0.5 - 2.0) * eased
      } else {
        // Second attempt: rotate on Z axis (already overlapped)
        mirrorRightRotationZ.value = 0 + (1.58 - 0) * eased
      }

      if (progress >= 1) {
        if (mirrorAttempt.value === 1) {
          // First attempt: need to slide over
          mirrorAnimationPhase.value = 'sliding'
        } else {
          // Second attempt: already overlapped, go straight to shaking
          mirrorAnimationPhase.value = 'shaking'
        }
        animationStartTime = timestamp
      }
    } else if (mirrorAnimationPhase.value === 'sliding') {
      const progress = Math.min(elapsed / SLIDE_DURATION, 1)
      const eased = easeInOutCubic(progress)
      mirrorRightPositionX.value = -216 * eased
      // Fade to 50% opacity as it slides over
      mirrorRightOpacity.value = 1.0 - 0.5 * eased

      if (progress >= 1) {
        mirrorAnimationPhase.value = 'shaking'
        animationStartTime = timestamp
      }
    } else if (mirrorAnimationPhase.value === 'shaking') {
      const progress = elapsed / SHAKE_DURATION
      const shakeAmount = Math.sin(progress * Math.PI * 8) * 8 * (1 - Math.min(progress, 1))
      mirrorShakeX.value = shakeAmount

      if (progress >= 1) {
        mirrorShakeX.value = 0
        if (mirrorAttempt.value === 1) {
          // After first failed attempt, try rotating on different axis (stay overlapped)
          mirrorAttempt.value = 2
          mirrorAnimationPhase.value = 'rotating'
        } else {
          // After second failed attempt, reset completely
          mirrorAnimationPhase.value = 'reset'
        }
        animationStartTime = timestamp
      }
    } else if (mirrorAnimationPhase.value === 'reset') {
      // Full reset after both attempts failed
      const progress = Math.min(elapsed / 800, 1)
      const eased = easeInOutCubic(progress)
      // Animate Z rotation back to 0 (from 1.58 where it ended)
      mirrorRightRotationZ.value = 1.58 * (1 - eased)
      // Also animate Y rotation back to starting position (2.0)
      mirrorRightRotationY.value = 0.5 + (2.0 - 0.5) * eased
      mirrorRightPositionX.value = -216 * (1 - eased)
      mirrorRightOpacity.value = 0.5 + 0.5 * eased

      if (progress >= 1) {
        // Reset for Next cycle
        mirrorAttempt.value = 1
        mirrorRightRotationY.value = 2.0
        mirrorRightRotationX.value = 0.5
        mirrorRightRotationZ.value = 0
        mirrorAnimationPhase.value = 'initial'
        page2AnimationCycles.value++
        animationStartTime = timestamp
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

function NextStep() {
  if (api.pathString === 'same_objects') {
    resetPage2Animation()
  }
  api.goNextStep()
}

function prevStep() {
  if (api.pathString === 'different_objects') {
    resetPage1Animation()
  } else if (api.pathString === 'response_keys') {
    resetPage2Animation()
  }
  api.goPrevStep()
}

function finish() {
  api.goNextView()
}

onMounted(() => {
  animationFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <ConstrainedTaskWindow
    variant="ghost"
    :responsiveUI="api.config.responsiveUI"
    :width="api.config.windowsizerRequest.width"
    :height="api.config.windowsizerRequest.height"
  >
    <div class="w-[90%] max-w-2xl">
      <!-- Page 1: Same objects -->
      <div v-if="api.pathString === 'same_objects'">
        <h1 class="text-2xl font-bold mb-4">
          <i-material-symbols-integration-instructions class="inline-block mr-2 text-3xl" /> Instructions
        </h1>

        <p class="text-left text-lg mb-6">
          In this task you will view two objects like the ones below side by side and judge if they are the
          <strong>same object</strong> or <strong>different objects</strong>.
        </p>

        <p class="text-left text-lg mb-6">
          Objects will not always appear at the same orientation. For example, one might be rotated relative to the
          other, but they can still be the same object:
        </p>

        <!-- Animated demo using ShepardMetzlerStim -->
        <div class="flex justify-center items-center mb-6 relative h-[220px]">
          <!-- Container for both stimuli with fixed positions -->
          <div class="relative" style="width: 416px; height: 200px">
            <!-- Left stimulus (reference) -->
            <div class="absolute left-0 top-0">
              <ShepardMetzlerStim
                :config="demoConfig"
                :width="200"
                :height="200"
                :rotationX="leftRotationX"
                :rotationY="leftRotationY"
                :rotationZ="0"
                cubeColor="#ffffff"
                edgeColor="#333333"
                class="border border-gray-300"
              />
            </div>

            <!-- Right stimulus (animating) -->
            <div class="absolute top-0" :style="{ left: `${216 + rightPositionX}px`, opacity: rightOpacity }">
              <ShepardMetzlerStim
                :config="demoConfig"
                :width="200"
                :height="200"
                :rotationX="rightRotationX"
                :rotationY="rightRotationY"
                :rotationZ="0"
                :mirror="false"
                cubeColor="#ffffff"
                edgeColor="#333333"
                class="border border-gray-300"
              />
            </div>
          </div>
        </div>

        <p class="text-center text-muted-foreground mb-6" v-if="animationPhase === 'aligned'">
          <i-fa6-solid-check class="inline-block mr-1 text-green-600" />
          <span class="text-green-600 font-medium">Same object!</span> They align when rotated.
        </p>
        <p class="text-center text-muted-foreground mb-6" v-else>
          Watch how the right object rotates to match the left...
        </p>

        <hr class="border-gray-300 my-4" />

        <div class="flex justify-end">
          <Button variant="default" :disabled="page1AnimationCycles < 2" @click="NextStep()">
            Next
            <i-fa6-solid-arrow-right class="ml-2" />
          </Button>
        </div>
      </div>

      <!-- Page 2: Different objects (mirror) -->
      <div v-else-if="api.pathString === 'different_objects'">
        <h1 class="text-2xl font-bold mb-4">
          <i-material-symbols-integration-instructions class="inline-block mr-2 text-3xl" /> Instructions (continued)
        </h1>

        <p class="text-left text-lg mb-6">
          However, some pairs are <strong>different objects</strong>. No matter how you rotate them, they will never
          align:
        </p>

        <!-- Animated demo for mirror using ShepardMetzlerStim -->
        <div class="flex justify-center items-center mb-6 relative h-[220px]">
          <!-- Container for both stimuli with fixed positions -->
          <div class="relative" style="width: 416px; height: 200px">
            <!-- Left stimulus (reference) -->
            <div class="absolute left-0 top-0">
              <ShepardMetzlerStim
                :config="demoConfig"
                :width="200"
                :height="200"
                :rotationX="0.5"
                :rotationY="mirrorLeftRotationY"
                :rotationZ="0"
                :mirror="false"
                cubeColor="#ffffff"
                edgeColor="#333333"
                class="border border-gray-300"
              />
            </div>

            <!-- Right stimulus (mirrored, animating) -->
            <div
              class="absolute top-0"
              :style="{ left: `${216 + mirrorRightPositionX + mirrorShakeX}px`, opacity: mirrorRightOpacity }"
            >
              <ShepardMetzlerStim
                :config="demoConfig"
                :width="200"
                :height="200"
                :rotationX="mirrorRightRotationX"
                :rotationY="mirrorRightRotationY"
                :rotationZ="mirrorRightRotationZ"
                :mirror="true"
                cubeColor="#ffffff"
                edgeColor="#333333"
                class="border border-gray-300"
              />
            </div>
          </div>
        </div>

        <p class="text-center text-muted-foreground mb-6" v-if="mirrorAnimationPhase === 'shaking'">
          <i-fa6-solid-xmark class="inline-block mr-1 text-red-600" />
          <span class="text-red-600 font-medium">Different objects!</span> They cannot be rotated to match.
        </p>
        <p class="text-center text-muted-foreground mb-6" v-else>
          Watch the rotation attempts... (Attempt {{ mirrorAttempt }} of 2)
        </p>

        <hr class="border-gray-300 my-4" />

        <div class="flex justify-between">
          <Button variant="outline" @click="prevStep()">
            <i-fa6-solid-arrow-left class="mr-2" />
            Previous
          </Button>
          <Button variant="default" :disabled="page2AnimationCycles < 2" @click="NextStep()">
            Next
            <i-fa6-solid-arrow-right class="ml-2" />
          </Button>
        </div>
      </div>

      <!-- Page 3: Response keys -->
      <div v-else-if="api.pathString === 'response_keys'">
        <h1 class="text-2xl font-bold mb-4">
          <i-material-symbols-integration-instructions class="inline-block mr-2 text-3xl" /> How to Respond
        </h1>

        <p class="text-left text-lg mb-6">
          For each pair of objects, you need to decide as quickly and accurately as possible whether they are the
          <strong>same</strong> or <strong>different</strong>.
        </p>

        <div class="bg-gray-100 rounded-lg p-6 mb-6">
          <div class="flex flex-col gap-6">
            <!-- Same key -->
            <div class="flex items-center gap-4">
              <kbd
                class="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-mono text-2xl font-bold shadow-md min-w-[60px] text-center"
                >S</kbd
              >
              <div class="text-left">
                <p class="text-lg font-semibold">Same Object</p>
                <p class="text-muted-foreground">
                  Press <strong>S</strong> or tap the <strong>Same</strong> button if the two objects are the same (just
                  rotated)
                </p>
              </div>
            </div>

            <!-- Different key -->
            <div class="flex items-center gap-4">
              <kbd
                class="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-mono text-2xl font-bold shadow-md min-w-[60px] text-center"
                >D</kbd
              >
              <div class="text-left">
                <p class="text-lg font-semibold">Different Objects</p>
                <p class="text-muted-foreground">
                  Press <strong>D</strong> or tap the <strong>Different</strong> button if the two objects are different
                  (not just rotated)
                </p>
              </div>
            </div>
          </div>
        </div>

        <p class="text-left text-lg mb-6">
          Try to respond as <strong>quickly</strong> as you can while still being <strong>accurate</strong>.
        </p>

        <hr class="border-gray-300 my-4" />

        <div class="flex justify-between">
          <Button variant="outline" @click="prevStep()">
            <i-fa6-solid-arrow-left class="mr-2" />
            Previous
          </Button>
          <Button variant="default" @click="finish()">
            Start Task
            <i-fa6-solid-arrow-right class="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  </ConstrainedTaskWindow>
</template>
