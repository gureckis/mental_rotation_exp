<script setup>
// Mental Rotation Experiment - Shepard-Metzler Stimuli

import useViewAPI from '@/core/composables/useViewAPI'
import { Button } from '@/uikit/components/ui/button'
import { ConstrainedTaskWindow } from '@/uikit/layouts'
import ShepardMetzlerStim from './ShepardMetzlerStim.vue'
import { stimulusConfigs } from './stimulusConfigs.js'

const api = useViewAPI()

// Define the trials for the experiment
const trials = api.steps.append([
  {
    id: 'mr',
    rt: () => api.faker.rnorm(2000, 500),
    response: () => api.faker.rchoice(['s', 'd']),
    inputMethod: () => api.faker.rchoice(['keyboard', 'button']),
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
api.persist.totalTrials = api.persist.totalTrials || 0
api.persist.correctTrials = api.persist.correctTrials || 0

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

// Handle response (either 's' for same or 'd' for different)
// inputMethod: 'keyboard' or 'button'
function handleResponse(response, inputMethod) {
  if (api.stepIndex < api.nSteps && api.path[0] === 'mr') {
    const reactionTime = api.elapsedTime()
    const isCorrect = (response === 's' && !api.stepData.mirror) || (response === 'd' && api.stepData.mirror)

    api.stepData.rt = reactionTime
    api.stepData.response = response
    api.stepData.inputMethod = inputMethod
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
}

// Handle 'S' (same) and 'D' (different) key presses
const stop = api.onKeyDown(
  ['s', 'S', 'd', 'D'],
  (e) => {
    e.preventDefault()
    handleResponse(e.key.toLowerCase(), 'keyboard')
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
      <p class="text-lg font-medium text-muted-foreground max-w-xl mt-6">Are these two views of the same object?</p>
      <div class="flex items-center gap-4 mt-4">
        <Button variant="outline" size="lg" @click="handleResponse('s', 'button')" class="min-w-32">
          <span class="font-bold">S</span>ame
        </Button>
        <Button variant="outline" size="lg" @click="handleResponse('d', 'button')" class="min-w-32">
          <span class="font-bold">D</span>ifferent
        </Button>
      </div>
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
