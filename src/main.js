import { format, parseISO } from 'date-fns'
import { TZDate } from '@date-fns/tz'
import '../styles.css'
import './register-sw'

// Show local or show UTC:
let currentMode = 'utc'

/**
 * Display the local time for a given UTC time:
 **/
function calculateLocal() {
  const dateInput = document.getElementById('date-input')
  const timezoneInput = document.getElementById('timezone-pick')
  const localTimeElement = document.getElementById('result-date')

  try {
    const dateInTimezone = new TZDate(
      dateInput.value,
      timezoneInput.value,
    ).toISOString()

    localTimeElement.textContent = dateInTimezone
    localTimeElement.classList.remove('highlight-animation')
    // Trigger reflow to restart animation
    void localTimeElement.offsetWidth
    localTimeElement.classList.add('highlight-animation')
  } catch (err) {
    localTimeElement.textContent = '---'
  }
}

/**
 * Display the UTC time for a given local time:
 */
function calculateUTC() {
  const localTimeInput = document.getElementById('local-date-input')
  const timezoneInput = document.getElementById('timezone-pick')
  const outputElement = document.getElementById('result-date')

  try {
    const match = localTimeInput.value.match(
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
    )
    const year = Number(match[1])
    const month = Number(match[2]) - 1
    const day = Number(match[3])
    const hour = Number(match[4])
    const minute = Number(match[5])

    const dateInTimezone = parseISO(
      new TZDate(
        year,
        month,
        day,
        hour,
        minute,
        timezoneInput.value,
      ).toISOString(),
    ).toISOString()
    outputElement.textContent = dateInTimezone
    outputElement.classList.remove('highlight-animation')
    // Trigger reflow to restart animation
    void outputElement.offsetWidth
    outputElement.classList.add('highlight-animation')
  } catch (err) {
    outputElement.textContent = '---'
  }
}

function calculate() {
  if (currentMode === 'local') {
    calculateLocal()
  } else if (currentMode === 'utc') {
    calculateUTC()
  } else {
    calculateLocal()
  }
}

function swapMode() {
  currentMode = currentMode === 'local' ? 'utc' : 'local'
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
