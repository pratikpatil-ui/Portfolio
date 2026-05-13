export const OPEN_ASSISTANT_EVENT = 'pp:open-assistant'
export const OPEN_PALETTE_EVENT = 'pp:open-palette'

export function openAssistant() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT))
}

export function openPalette() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT))
}
