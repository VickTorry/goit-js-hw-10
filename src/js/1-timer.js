"use strict";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// DOM-елементи
const startButton = document.querySelector("[data-start]");
const input = document.getElementById("datetime-picker");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let countdownInterval = null;

// Початковий стан
startButton.disabled = true;

// Ініціалізація flatpickr
flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      showError("Please choose a date in the future");
      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
});

// Обробник кліку на Start
startButton.addEventListener("click", () => {
  if (!userSelectedDate) return;

  // Заблокувати кнопку та інпут
  startButton.disabled = true;
  input.disabled = true;

  clearInterval(countdownInterval); // Очистити попередній таймер

  countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      updateDisplay(0, 0, 0, 0);

      input.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);
    updateDisplay(days, hours, minutes, seconds);
  }, 1000);
});

// Оновлення DOM
function updateDisplay(days, hours, minutes, seconds) {
  daysEl.textContent = String(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Конвертація часу
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// iziToast повідомлення
function showError(message) {
  iziToast.error({
    title: "Error",
    message: message,
    position: "topRight",
    timeout: 3000,
  });
}



