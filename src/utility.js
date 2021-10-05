// a place for utility functions that I would rather keep separate from any component

//The maximum is exclusive and the minimum is inclusive
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
