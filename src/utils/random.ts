/**
 * Return a random number between a range with min and max inclusive
 * @param min minimun number that can be return
 * @param max maximum number that can be return
 * @returns
 */
export const getRandomNumber = (min = 0, max = 10) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};
