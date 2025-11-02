'use client'

import { ImageUploadButton } from './image-upload-button'
import { FileUploadButton } from './file-upload-button'
import { OptimizeButton } from './optimize-button'
import { VoiceButton } from './voice-button'
import { SendButton } from './send-button'

export function ToolButtons() {
  return (
    <div className="flex items-center gap-1">
      <ImageUploadButton />
      <FileUploadButton />
      <OptimizeButton />
    </div>
  )
}

export { VoiceButton, SendButton }
