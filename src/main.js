import { format, parseISO } from 'date-fns'
import { TZDate } from '@date-fns/tz'
import '../styles.css'

// Show local or show ISO:
let currentMode = 'local'

function calculateLocal() {
  const dateInput = document.getElementById('date-input')
  const timezoneInput = document.getElementById('timezone-pick')
  const localTimeElement = document.getElementById('result-date')

  try {
    const dateInTimezone = new TZDate(dateInput.value)
      .withTimeZone(timezoneInput.value)
      .toString()
    localTimeElement.textContent = dateInTimezone
    localTimeElement.classList.remove('highlight-animation')
    // Trigger reflow to restart animation
    void localTimeElement.offsetWidth
    localTimeElement.classList.add('highlight-animation')
  } catch (err) {
    localTimeElement.textContent = '---'
  }
}

function calculateIso() {
  const localTimeInput = document.getElementById('local-date-input')
  const timezoneInput = document.getElementById('timezone-pick')
  const isoTimeElement = document.getElementById('result-date')

  try {
    const localDateTime = new TZDate(localTimeInput.value + `:00.000Z`)
      .withTimeZone(timezoneInput.value)
      .toISOString()
    isoTimeElement.textContent = format(
      new Date(localDateTime),
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    )
    isoTimeElement.classList.remove('highlight-animation')
    // Trigger reflow to restart animation
    void isoTimeElement.offsetWidth
    isoTimeElement.classList.add('highlight-animation')
  } catch (err) {
    isoTimeElement.textContent = '---'
  }
}

function calculate() {
  if (currentMode === 'local') {
    calculateLocal()
  } else {
    calculateIso()
  }
}

function swapMode() {
  currentMode = currentMode === 'local' ? 'iso' : 'local'
  if (currentMode === 'local') {
    document
      .getElementById('local-date-input-container')
      .classList.add('hidden')
    document.getElementById('date-input-container').classList.remove('hidden')
  } else {
    document
      .getElementById('local-date-input-container')
      .classList.remove('hidden')
    document.getElementById('date-input-container').classList.add('hidden')
  }

  calculate()
}

function init() {
  document.getElementById('swap-mode').addEventListener('click', swapMode)

  const dateInput = document.getElementById('date-input')
  // Start with the current date:
  dateInput.value = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
  const localInput = document.getElementById('local-date-input')
  localInput.value = format(new Date(), "yyyy-MM-dd'T'HH:mm")

  calculate()

  dateInput.addEventListener('blur', () => {
    calculate()
  })
  localInput.addEventListener('input', () => {
    calculate()
  })

  document.getElementById('date-form').addEventListener('submit', (e) => {
    e.preventDefault()
    calculate()
  })

  document.getElementById('timezone-pick').addEventListener('change', (e) => {
    calculate()
  })
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init)
