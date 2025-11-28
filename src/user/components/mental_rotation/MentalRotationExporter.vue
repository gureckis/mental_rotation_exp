<script setup>
import { ref, computed } from 'vue'
import useViewAPI from '@/core/composables/useViewAPI'
import { Button } from '@/uikit/components/ui/button'
import { Textarea } from '@/uikit/components/ui/textarea'
import { ConstrainedTaskWindow } from '@/uikit/layouts'

const api = useViewAPI()

// Get study data from store
const studyDataJson = computed(() => {
  return JSON.stringify(api.store.data.studyData, null, 2)
})

// Copy status feedback
const copyStatus = ref('')

// Copy to clipboard function
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(studyDataJson.value)
    copyStatus.value = 'Copied!'
    setTimeout(() => {
      copyStatus.value = ''
    }, 2000)
  } catch (err) {
    copyStatus.value = 'Failed to copy'
    setTimeout(() => {
      copyStatus.value = ''
    }, 2000)
  }
}

function finish() {
  api.goNextView()
}
</script>

<template>
  <ConstrainedTaskWindow
    variant="ghost"
    :responsiveUI="api.config.responsiveUI"
    :width="api.config.windowsizerRequest.width"
    :height="700"
  >
    <div class="flex flex-col items-center gap-4 p-4">
      <h2 class="text-2xl font-bold">Your Data</h2>
      <p class="text-muted-foreground text-center max-w-lg">
        Below is the data from your mental rotation task. You can copy it to your clipboard to save it.
      </p>

      <div class="w-full max-w-2xl">
        <Textarea
          readonly
          :model-value="studyDataJson"
          class="h-64 font-mono text-sm resize-none"
        />
      </div>

      <div class="flex items-center gap-4">
        <Button variant="outline" @click="copyToClipboard">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy to Clipboard
        </Button>
        <span v-if="copyStatus" class="text-sm text-green-600 dark:text-green-400">{{ copyStatus }}</span>
      </div>

      <Button variant="default" size="lg" class="mt-4" @click="finish">
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
  </ConstrainedTaskWindow>
</template>
