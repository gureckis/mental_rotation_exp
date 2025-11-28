<script setup>
// Mental Rotation Experiment - Shepard-Metzler Stimuli

import useViewAPI from '@/core/composables/useViewAPI'
import { Button } from '@/uikit/components/ui/button'
import { ConstrainedTaskWindow } from '@/uikit/layouts'
import ShepardMetzlerStim from './ShepardMetzlerStim.vue'

const api = useViewAPI()

api.persist.totalTrials = api.persist.totalTrials || 0
api.persist.correctTrials = api.persist.correctTrials || 0

// Define a set of Shepard-Metzler stimulus configurations
// Format: "L1D1-L2D2-L3D3-L4D4" where L=length(2-4), D=direction
const stimulusConfigs = [
  {
    config: '3X+-2U-4L-3D',
    leftRotationX: -0.017,
    leftRotationY: 0.506,
    leftRotationZ: 0,
    rightDeltaX: -1.588,
    rightDeltaY: 0,
    rightDeltaZ: 0,
    disparity: -91,
    mirror: false,
  },
  {
    config: '2Z+-3B-2U-4F',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 1.449,
    rightDeltaZ: 0,
    disparity: 83,
    mirror: false,
  },
  {
    config: '4Z+-3R-4D-2B',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: -1.344,
    disparity: -77,
    mirror: false,
  },
  {
    config: '3Y--4R-4F-2R',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 1.955,
    rightDeltaY: 0,
    rightDeltaZ: 0,
    disparity: 112,
    mirror: false,
  },
  {
    config: '2Y--2B-4U-3U',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0.297,
    rightDeltaY: 0,
    rightDeltaZ: 0,
    disparity: 17,
    mirror: false,
  },
  {
    config: '3X+-4L-2U-4B',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 1.187,
    disparity: 68,
    mirror: false,
  },
  {
    config: '3Z--4L-3R-2R',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.292,
    rightDeltaZ: 0,
    disparity: -74,
    mirror: false,
  },
  {
    config: '4X+-3D-4D-3B',
    leftRotationX: 0,
    leftRotationY: -1.431,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.955,
    rightDeltaZ: 0,
    disparity: -112,
    mirror: false,
  },
  {
    config: '2X--3B-3U-4R',
    leftRotationX: -0.175,
    leftRotationY: -0.035,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: -0.646,
    disparity: -37,
    mirror: false,
  },
  {
    config: '4Z+-3U-2U-2R',
    leftRotationX: 0,
    leftRotationY: -1.885,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 0.733,
    disparity: 42,
    mirror: false,
  },
  {
    config: '3Z+-3R-3D-3B',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 1.972,
    rightDeltaX: 0,
    rightDeltaY: -1.204,
    rightDeltaZ: 0,
    disparity: -69,
    mirror: false,
  },
  {
    config: '3Z+-2R-3R-2L',
    leftRotationX: 0,
    leftRotationY: -1.641,
    leftRotationZ: 0,
    rightDeltaX: 0.349,
    rightDeltaY: 0,
    rightDeltaZ: 0,
    disparity: 20,
    mirror: false,
  },
  {
    config: '4Y+-4L-3L-3R',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0.628,
    rightDeltaZ: 0,
    disparity: 36,
    mirror: false,
  },
  {
    config: '3X--2B-3U-3R',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 1.065,
    rightDeltaZ: 0,
    disparity: 61,
    mirror: false,
  },
  {
    config: '4Y--3R-3F-3U',
    leftRotationX: 0,
    leftRotationY: -0.401,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 3.142,
    disparity: 180,
    mirror: false,
  },
  {
    config: '2Z+-3F-3D-3U',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 1.222,
    rightDeltaX: 0,
    rightDeltaY: -1.571,
    rightDeltaZ: 0,
    disparity: -90,
    mirror: false,
  },
  {
    config: '3Z+-4R-3L-4D',
    leftRotationX: 0,
    leftRotationY: 0.035,
    leftRotationZ: 0.401,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 2.391,
    disparity: 137,
    mirror: false,
  },
  {
    config: '3Y+-4R-3U-4R',
    leftRotationX: 0,
    leftRotationY: -1.431,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 0.855,
    disparity: 49,
    mirror: false,
  },
  {
    config: '3X--2B-4F-2U',
    leftRotationX: 0,
    leftRotationY: 0.419,
    leftRotationZ: -1.152,
    rightDeltaX: 0.855,
    rightDeltaY: 0,
    rightDeltaZ: 0,
    disparity: 49,
    mirror: false,
  },
  {
    config: '4Y--2L-4L-3F',
    leftRotationX: 0,
    leftRotationY: 1.71,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: -1.466,
    disparity: -84,
    mirror: false,
  },
  {
    config: '2Z+-3U-2D-2B',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 3.142,
    disparity: 180,
    mirror: false,
  },
  {
    config: '3Y+-2D-2B-2U',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: -0.297,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: -1.449,
    disparity: -83,
    mirror: false,
  },
  {
    config: '4X+-4U-3B-3L',
    leftRotationX: 0,
    leftRotationY: -1.309,
    leftRotationZ: 0.297,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 1.292,
    disparity: 74,
    mirror: false,
  },
  {
    config: '4X--4B-2U-3R',
    leftRotationX: 2.775,
    leftRotationY: 1.117,
    leftRotationZ: 0.332,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: -3.072,
    disparity: -176,
    mirror: false,
  },
  {
    config: '4Y--2R-4F-3B',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: -1.466,
    disparity: -84,
    mirror: false,
  },
  {
    config: '2Y+-4L-4D-3F',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 1.815,
    disparity: 104,
    mirror: false,
  },
  {
    config: '3Z+-3B-4L-4L',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: -0.297,
    rightDeltaY: 0,
    rightDeltaZ: 0,
    disparity: -17,
    mirror: false,
  },
  {
    config: '3Z--4L-3D-3F',
    leftRotationX: 0.175,
    leftRotationY: 0.314,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 1.03,
    rightDeltaZ: 0,
    disparity: 59,
    mirror: false,
  },
  {
    config: '4Z--3D-4U-4R',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: -2.845,
    disparity: -163,
    mirror: false,
  },
  {
    config: '3Y+-4U-2U-4F',
    leftRotationX: 0,
    leftRotationY: 1.571,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -2.897,
    rightDeltaZ: 0,
    disparity: -166,
    mirror: false,
  },
  {
    config: '3X+-4U-2B-3R',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 1.641,
    rightDeltaZ: 0,
    disparity: 94,
    mirror: true,
  },
  {
    config: '4X+-2B-3B-3D',
    leftRotationX: 0,
    leftRotationY: 2.985,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 1.955,
    rightDeltaZ: 0,
    disparity: 112,
    mirror: true,
  },
  {
    config: '2Z+-2U-2L-4D',
    leftRotationX: 0,
    leftRotationY: 1.431,
    leftRotationZ: 1.466,
    rightDeltaX: 0,
    rightDeltaY: -3.142,
    rightDeltaZ: 0,
    disparity: -180,
    mirror: true,
  },
  {
    config: '4X+-3D-2F-3U',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -0.035,
    rightDeltaZ: 0,
    disparity: -2,
    mirror: true,
  },
  {
    config: '3Z--3U-3B-2R',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.431,
    rightDeltaZ: 0,
    disparity: -82,
    mirror: true,
  },
  {
    config: '4X--2L-4B-3D',
    leftRotationX: 0,
    leftRotationY: -1.571,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0.314,
    rightDeltaZ: 0,
    disparity: 18,
    mirror: true,
  },
  {
    config: '2Z+-3U-2D-4L',
    leftRotationX: -0.122,
    leftRotationY: 3.142,
    leftRotationZ: 0.297,
    rightDeltaX: 0,
    rightDeltaY: 1.204,
    rightDeltaZ: 0,
    disparity: 69,
    mirror: true,
  },
  {
    config: '4Y--4F-4R-4R',
    leftRotationX: 0,
    leftRotationY: 0.524,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 2.513,
    rightDeltaZ: 0,
    disparity: 144,
    mirror: true,
  },
  {
    config: '3Z+-3F-3D-4B',
    leftRotationX: 0,
    leftRotationY: -2.129,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -2.443,
    rightDeltaZ: 0,
    disparity: -140,
    mirror: true,
  },
  {
    config: '2Y+-3L-3B-4B',
    leftRotationX: 0,
    leftRotationY: -0.471,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.553,
    rightDeltaZ: 0,
    disparity: -89,
    mirror: true,
  },
  {
    config: '2X+-4F-2B-4U',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 1.134,
    rightDeltaZ: 0,
    disparity: 65,
    mirror: true,
  },
  {
    config: '2Z--4R-3R-4F',
    leftRotationX: 0,
    leftRotationY: 1.553,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.693,
    rightDeltaZ: 0,
    disparity: -97,
    mirror: true,
  },
  {
    config: '2X--4R-4U-3F',
    leftRotationX: 0,
    leftRotationY: 1.431,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 0,
    disparity: 0,
    mirror: true,
  },
  {
    config: '2X+-3B-4F-4U',
    leftRotationX: 0,
    leftRotationY: 0.262,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.693,
    rightDeltaZ: 0,
    disparity: -97,
    mirror: true,
  },
  {
    config: '3Y--2F-4U-2D',
    leftRotationX: 0,
    leftRotationY: -0.105,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 1.815,
    rightDeltaZ: 0,
    disparity: 104,
    mirror: true,
  },
  {
    config: '3X--4B-4D-2D',
    leftRotationX: 0,
    leftRotationY: -0.419,
    leftRotationZ: 1.431,
    rightDeltaX: 0,
    rightDeltaY: 0.471,
    rightDeltaZ: 0,
    disparity: 27,
    mirror: true,
  },
  {
    config: '3X--2L-3L-4F',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.501,
    rightDeltaZ: 0,
    disparity: -86,
    mirror: true,
  },
  {
    config: '2X+-3D-3D-4F',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0.279,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 0,
    disparity: 0,
    mirror: true,
  },
  {
    config: '3Y--4R-2D-2B',
    leftRotationX: 0,
    leftRotationY: 3.089,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 0,
    disparity: 0,
    mirror: true,
  },
  {
    config: '2X--2U-3D-4F',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0.541,
    rightDeltaZ: 0,
    disparity: 31,
    mirror: true,
  },
  {
    config: '2X--4F-2B-2F',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 1.693,
    disparity: 97,
    mirror: true,
  },
  {
    config: '4X--4B-2U-4U',
    leftRotationX: 0,
    leftRotationY: 1.536,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 0.209,
    disparity: 12,
    mirror: true,
  },
  {
    config: '3Z+-3B-3U-4U',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 1.955,
    disparity: 112,
    mirror: true,
  },
  {
    config: '2Y+-2D-2F-4F',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.518,
    rightDeltaZ: 0,
    disparity: -87,
    mirror: true,
  },
  {
    config: '4X+-3L-4D-2F',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.728,
    rightDeltaZ: 0,
    disparity: -99,
    mirror: true,
  },
  {
    config: '2Z--3R-4U-3R',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.745,
    rightDeltaZ: 0,
    disparity: -100,
    mirror: true,
  },
  {
    config: '2Z+-4U-3U-3D',
    leftRotationX: -0.07,
    leftRotationY: -1.641,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 2.932,
    rightDeltaZ: 0,
    disparity: 168,
    mirror: true,
  },
  {
    config: '2Z+-2F-4U-3D',
    leftRotationX: 0,
    leftRotationY: -1.379,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: 0,
    rightDeltaZ: 2.932,
    disparity: 168,
    mirror: true,
  },
  {
    config: '3Z--2D-4B-3L',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -3.142,
    rightDeltaZ: 0,
    disparity: -180,
    mirror: true,
  },
  {
    config: '3Z+-2F-3L-3L',
    leftRotationX: 0,
    leftRotationY: 0,
    leftRotationZ: 0,
    rightDeltaX: 0,
    rightDeltaY: -1.641,
    rightDeltaZ: 0,
    disparity: -94,
    mirror: true,
  },
]

// Define the trials for the experiment
const trials = api.steps.append([
  {
    id: 'mr',
    rt: () => api.faker.rnorm(2000, 500),
    response: () => api.faker.rchoice(['s', 'd']),
    correct: () => api.faker.rbinom(1, 0.8),
  },
])

// Add each stimulus as a trial using the fixed configurations
// Right rotations are computed as left + delta
trials[0]
  .append(
    stimulusConfigs.map((stim) => ({
      ...stim,
      // Compute right rotations from left + delta
      rightRotationX: stim.leftRotationX + stim.rightDeltaX,
      rightRotationY: stim.leftRotationY + stim.rightDeltaY,
      rightRotationZ: (stim.leftRotationZ || 0) + (stim.rightDeltaZ || 0),
    }))
  )
  .shuffle()

trials.append([{ id: 'summary' }])

// Initialize persistent tracking for accuracy
if (!api.persist.isDefined('totalTrials')) {
  api.persist.totalTrials = 0
  api.persist.correctTrials = 0
}

// Start timer
if (!api.isTimerStarted()) {
  api.startTimer()
}

// Autofill function
// function autofill() {
//   while (api.stepIndex < api.nSteps) {
//     api.faker.render(api.stepData)
//     api.recordStep()
//     api.goNextStep()
//   }
// }

// api.setAutofill(autofill)

// Handle 'S' (same) and 'D' (different) key presses
const stop = api.onKeyDown(
  ['s', 'S', 'd', 'D'],
  (e) => {
    if (api.stepIndex < api.nSteps && api.path[0] === 'mr') {
      e.preventDefault()
      const reactionTime = api.elapsedTime()
      const response = e.key.toLowerCase()
      const isCorrect = (response === 's' && !api.stepData.mirror) || (response === 'd' && api.stepData.mirror)

      api.stepData.rt = reactionTime
      api.stepData.response = response
      api.stepData.correct = isCorrect ? 1 : 0

      // Update accuracy tracking
      api.persist.totalTrials++
      if (isCorrect) {
        api.persist.correctTrials++
      }

      api.recordStep()
      api.goNextStep()
      api.startTimer() // Restart timer for next trial

      if (api.path[0] === 'summary') {
        stop()
      }
    }
  },
  { dedupe: true }
)

function finish() {
  api.goNextView()
}
</script>

<template>
  <ConstrainedTaskWindow
    variant="ghost"
    :responsiveUI="api.config.responsiveUI"
    :width="api.config.windowsizerRequest.width"
    :height="api.config.windowsizerRequest.height"
  >
    <!-- Show stimulus for each trial -->
    <div class="text-center flex flex-col items-center" v-if="api.path[0] === 'mr'">
      <div class="flex items-center gap-8">
        <!-- Left stimulus -->
        <ShepardMetzlerStim
          :config="api.stepData.config"
          :width="250"
          :height="250"
          :rotationX="api.stepData.leftRotationX"
          :rotationY="api.stepData.leftRotationY"
          :rotationZ="api.stepData.leftRotationZ || 0"
          cubeColor="#ffffff"
          edgeColor="#333333"
          class="border border-gray-300 rounded-full"
        />
        <!-- Right stimulus (rotated differently, possibly mirrored) -->
        <ShepardMetzlerStim
          :config="api.stepData.config"
          :width="250"
          :height="250"
          :rotationX="api.stepData.rightRotationX"
          :rotationY="api.stepData.rightRotationY"
          :rotationZ="api.stepData.rightRotationZ || 0"
          :mirror="api.stepData.mirror"
          cubeColor="#ffffff"
          edgeColor="#333333"
          class="border border-gray-300 rounded-full"
        />
      </div>
      <p class="text-lg font-medium text-muted-foreground max-w-xl mt-6">
        Quickly press 'S' if these are the same items just rotated, or 'D' if they are different objects and cannot be
        rotated into alignment.
      </p>
      <p class="text-sm text-muted-foreground mt-4">Trial {{ api.stepIndex + 1 }} of {{ api.nSteps - 1 }}</p>
    </div>

    <!-- Summary screen -->
    <div class="text-center" v-else>
      <h2 class="text-2xl font-bold mb-4">Task Complete!</h2>
      <p class="text-lg text-muted-foreground mb-2">Thanks! You have finished the mental rotation task.</p>
      <div class="bg-muted rounded-lg p-6 inline-block mb-6">
        <p class="text-lg font-medium">
          You answered <span class="text-primary font-bold">{{ api.persist.correctTrials }}</span> out of
          <span class="font-bold">{{ api.persist.totalTrials }}</span> trials correctly.
        </p>
        <p class="text-2xl font-bold mt-2">
          Accuracy: {{ Math.round((api.persist.correctTrials / api.persist.totalTrials) * 100) }}%
        </p>
      </div>
      <div>
        <Button variant="default" size="lg" @click="finish()">
          Continue
          <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </div>
  </ConstrainedTaskWindow>
</template>
