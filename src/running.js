import { format } from 'date-fns'
import { TZDate } from '@date-fns/tz'
import '../styles.css'
import './register-sw'

function updateRunningTime() {
  const runningTimeElement = document.getElementById('running-time')
  if (!runningTimeElement) return

  // Format the current UTC time
  const now = new Date()
  const utcTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

  // Display the UTC time
  runningTimeElement.textContent = utcTime

  // Update like crazy
  setTimeout(updateRunningTime, 100)
}

function init() {
  // Start the running time
  updateRunningTime()
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init)
