export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function toUpperCase(str) {
  return str
    .split(' ')
    .map((substr) => substr[0].toUpperCase() + substr.slice(1))
    .join(' ');
}

export function getIconUrl(icon, { large = false } = {}) {
  const size = large ? '@2x' : '';
  return `http://openweathermap.org/img/wn/${icon}${size}.png`;
}

// export function hours12(date) {
//   return date.toLocaleString('en-US', {
//     hour: 'numeric',
//     hour12: true,
//   });
// }

export function setValue(selector, value, { parent = document } = {}) {
  // eslint-disable-next-line no-param-reassign
  parent.querySelector(selector).textContent = value;
}
