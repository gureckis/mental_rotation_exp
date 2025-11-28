<script setup>
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import { ClipboardCopy, ArrowRight, FileSpreadsheet } from 'lucide-vue-next'
import useViewAPI from '@/core/composables/useViewAPI'
import { Button } from '@/uikit/components/ui/button'
import { Textarea } from '@/uikit/components/ui/textarea'
import { ConstrainedTaskWindow } from '@/uikit/layouts'

const api = useViewAPI()

// CSV columns for mental rotation trials
const csvColumns = [
  'trial',
  'userId',
  'config',
  'mirror',
  'disparity',
  'response',
  'correct',
  'rt',
  'leftRotationX',
  'leftRotationY',
  'leftRotationZ',
  'rightRotationX',
  'rightRotationY',
  'rightRotationZ',
  'rightDeltaX',
  'rightDeltaY',
  'rightDeltaZ',
]

// Convert study data to CSV format (only mental rotation trials)
const studyDataCsv = computed(() => {
  const studyData = api.store.data.studyData || []
  const userId = api.store.getShortId

  // Filter only mental rotation trials (those with rightDeltaX property)
  const mrTrials = studyData.filter((trial) => 'rightDeltaX' in trial)

  // Create CSV header
  const header = csvColumns.join(',')

  // Create CSV rows
  const rows = mrTrials.map((trial, index) => {
    return csvColumns
      .map((col) => {
        if (col === 'trial') return index + 1
        if (col === 'userId') return userId
        const value = trial[col]
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      })
      .join(',')
  })

  return [header, ...rows].join('\n')
})

// Copy to clipboard function
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(studyDataCsv.value)
    toast.success('Copied to clipboard!', { position: 'bottom-right', style: { right: '1rem', left: 'auto' } })
  } catch (err) {
    toast.error('Failed to copy to clipboard', { position: 'bottom-right', style: { right: '1rem', left: 'auto' } })
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
    <div class="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold flex items-center gap-2">
        <FileSpreadsheet class="w-6 h-6" />
        Your Data
      </h2>
      <p class="text-muted-foreground">
        Below is the anonymized data from your mental rotation task in CSV format. You can copy it to your clipboard to
        save it.
      </p>

      <div class="w-full">
        <Textarea readonly :model-value="studyDataCsv" class="h-64 font-mono text-sm resize-none bg-background" />
      </div>

      <div class="flex items-center gap-4">
        <Button variant="outline" size="lg" @click="copyToClipboard">
          <ClipboardCopy class="w-4 h-4 mr-2" />
          Copy to Clipboard
        </Button>
        <Button variant="default" size="lg" @click="finish">
          Continue
          <ArrowRight class="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  </ConstrainedTaskWindow>
</template>
