<script setup>
// Mental Rotation Stimulus Builder Tool

import { ref, computed } from 'vue'
import useViewAPI from '@/core/composables/useViewAPI'
import { Button } from '@/uikit/components/ui/button'
import { ConstrainedTaskWindow } from '@/uikit/layouts'
import ShepardMetzlerStim from './ShepardMetzlerStim.vue'

const api = useViewAPI()

// Left (standard) stimulus rotations (in degrees for slider, converted to radians for component)
const leftRotationXDeg = ref(29) // ~0.5 radians
const leftRotationYDeg = ref(29)
const leftRotationZDeg = ref(0)

// Right stimulus delta rotations (in degrees)
const rightDeltaXDeg = ref(0)
const rightDeltaYDeg = ref(0)
const rightDeltaZDeg = ref(0)

// Convert degrees to radians
const toRadians = (deg) => (deg * Math.PI) / 180

// Computed rotations in radians for the components
const leftRotationX = computed(() => toRadians(leftRotationXDeg.value))
const leftRotationY = computed(() => toRadians(leftRotationYDeg.value))
const leftRotationZ = computed(() => toRadians(leftRotationZDeg.value))

const rightRotationX = computed(() => toRadians(leftRotationXDeg.value + rightDeltaXDeg.value))
const rightRotationY = computed(() => toRadians(leftRotationYDeg.value + rightDeltaYDeg.value))
const rightRotationZ = computed(() => toRadians(leftRotationZDeg.value + rightDeltaZDeg.value))

// Mirror toggle
const mirror = ref(false)

// Current stimulus config
const currentConfig = ref('3X+-2U-4L-3D')

// Compute disparity - the non-zero delta value in degrees
const disparity = computed(() => {
  if (rightDeltaXDeg.value !== 0) return rightDeltaXDeg.value
  if (rightDeltaYDeg.value !== 0) return rightDeltaYDeg.value
  if (rightDeltaZDeg.value !== 0) return rightDeltaZDeg.value
  return 0
})

// Generate the full config string for export
const exportConfig = computed(() => {
  return JSON.stringify({
    config: currentConfig.value,
    leftRotationX: Number(leftRotationX.value.toFixed(3)),
    leftRotationY: Number(leftRotationY.value.toFixed(3)),
    leftRotationZ: Number(leftRotationZ.value.toFixed(3)),
    rightDeltaX: Number(toRadians(rightDeltaXDeg.value).toFixed(3)),
    rightDeltaY: Number(toRadians(rightDeltaYDeg.value).toFixed(3)),
    rightDeltaZ: Number(toRadians(rightDeltaZDeg.value).toFixed(3)),
    disparity: disparity.value,
    mirror: mirror.value,
  })
})

// Copy config to clipboard
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(exportConfig.value)
    alert('Copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Generate a new random stimulus
function generateNewStimulus() {
  const axes = ['X', 'Y', 'Z']
  const signs = ['+', '-']
  const turns = ['U', 'D', 'L', 'R', 'F', 'B']
  const lengths = [2, 3, 4]

  const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)]

  const seg1Length = randomChoice(lengths)
  const seg1Axis = randomChoice(axes)
  const seg1Sign = randomChoice(signs)

  const seg2Length = randomChoice(lengths)
  const seg2Turn = randomChoice(turns)

  const seg3Length = randomChoice(lengths)
  const seg3Turn = randomChoice(turns)

  const seg4Length = randomChoice(lengths)
  const seg4Turn = randomChoice(turns)

  currentConfig.value = `${seg1Length}${seg1Axis}${seg1Sign}-${seg2Length}${seg2Turn}-${seg3Length}${seg3Turn}-${seg4Length}${seg4Turn}`

  // Reset left rotations to 0
  leftRotationXDeg.value = 0
  leftRotationYDeg.value = 0
  leftRotationZDeg.value = 0

  // Reset right deltas to 0
  rightDeltaXDeg.value = 0
  rightDeltaYDeg.value = 0
  rightDeltaZDeg.value = 0
}

function toggleMirror() {
  mirror.value = !mirror.value
}
</script>

<template>
  <ConstrainedTaskWindow
    variant="ghost"
    :responsiveUI="api.config.responsiveUI"
    :width="api.config.windowsizerRequest.width"
    :height="700"
  >
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6 text-center">Mental Rotation Stimulus Builder</h1>

      <!-- Stimuli display -->
      <div class="flex justify-center items-start gap-8 mb-8">
        <!-- Left stimulus with controls -->
        <div class="flex flex-col items-center">
          <div class="text-sm font-medium mb-2">Standard (Left)</div>
          <ShepardMetzlerStim
            :config="currentConfig"
            :width="250"
            :height="250"
            :rotationX="leftRotationX"
            :rotationY="leftRotationY"
            :rotationZ="leftRotationZ"
            cubeColor="#ffffff"
            edgeColor="#333333"
            class="border border-gray-300 rounded-full"
          />
          <!-- Rotation sliders for left -->
          <div class="mt-4 w-full max-w-[250px] space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground w-8">X:</span>
              <input
                type="range"
                v-model.number="leftRotationXDeg"
                min="-180"
                max="180"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-xs text-muted-foreground w-10 text-right">{{ leftRotationXDeg }}°</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground w-8">Y:</span>
              <input
                type="range"
                v-model.number="leftRotationYDeg"
                min="-180"
                max="180"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-xs text-muted-foreground w-10 text-right">{{ leftRotationYDeg }}°</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground w-8">Z:</span>
              <input
                type="range"
                v-model.number="leftRotationZDeg"
                min="-180"
                max="180"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-xs text-muted-foreground w-10 text-right">{{ leftRotationZDeg }}°</span>
            </div>
          </div>
        </div>

        <!-- Right stimulus with controls -->
        <div class="flex flex-col items-center">
          <div class="text-sm font-medium mb-2">
            Comparison (Right) <span v-if="mirror" class="text-red-500">[MIRRORED]</span>
          </div>
          <ShepardMetzlerStim
            :config="currentConfig"
            :width="250"
            :height="250"
            :rotationX="rightRotationX"
            :rotationY="rightRotationY"
            :rotationZ="rightRotationZ"
            :mirror="mirror"
            cubeColor="#ffffff"
            edgeColor="#333333"
            class="border border-gray-300 rounded-full"
          />
          <!-- Rotation delta sliders for right -->
          <div class="mt-4 w-full max-w-[250px] space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground w-12">ΔX:</span>
              <input
                type="range"
                v-model.number="rightDeltaXDeg"
                min="-180"
                max="180"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-xs text-muted-foreground w-10 text-right">{{ rightDeltaXDeg }}°</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground w-12">ΔY:</span>
              <input
                type="range"
                v-model.number="rightDeltaYDeg"
                min="-180"
                max="180"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-xs text-muted-foreground w-10 text-right">{{ rightDeltaYDeg }}°</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground w-12">ΔZ:</span>
              <input
                type="range"
                v-model.number="rightDeltaZDeg"
                min="-180"
                max="180"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-xs text-muted-foreground w-10 text-right">{{ rightDeltaZDeg }}°</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Control buttons -->
      <div class="flex justify-center gap-4 mb-6">
        <Button variant="default" @click="generateNewStimulus">New Stimulus</Button>
        <Button variant="outline" @click="toggleMirror">
          {{ mirror ? 'Disable Mirror' : 'Enable Mirror' }}
        </Button>
      </div>

      <!-- Config display -->
      <div class="text-center">
        <div class="text-sm text-muted-foreground mb-2">Current Configuration (click to copy):</div>
        <div
          @click="copyToClipboard"
          class="p-4 bg-muted rounded-lg font-mono text-sm cursor-pointer hover:bg-muted/80 transition-colors break-all"
        >
          {{ exportConfig }}
        </div>
      </div>

    </div>
  </ConstrainedTaskWindow>
</template>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #000000;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #000000;
  cursor: pointer;
  border: none;
}
</style>
