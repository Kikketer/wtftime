import { format, parseISO } from "date-fns";
import { TZDate } from "@date-fns/tz";

function calculateDates() {
  const dateInput = document.getElementById("date-input");
  const timezoneInput = document.getElementById("timezone-pick");
  const localTimeElement = document.getElementById("local-time");

  try {
    const dateInTimezone = new TZDate(dateInput.value)
      .withTimeZone(timezoneInput.value)
      .toString();
    localTimeElement.textContent = dateInTimezone;
    localTimeElement.classList.remove("highlight-animation");
    // Trigger reflow to restart animation
    void localTimeElement.offsetWidth;
    localTimeElement.classList.add("highlight-animation");
  } catch (err) {
    localTimeElement.textContent = "---";
  }
}

function init() {
  const dateInput = document.getElementById("date-input");
  // Start with the current date:
  dateInput.value = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

  calculateDates();

  document.getElementById("date-form").addEventListener("submit", (e) => {
    e.preventDefault();
    calculateDates();
  });

  document.getElementById("timezone-pick").addEventListener("change", (e) => {
    calculateDates();
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
