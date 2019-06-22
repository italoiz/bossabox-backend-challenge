/**
 * Get random item of array.
 *
 * @param {Array} arr
 *
 * @return {Object}
 */
function getRandomItem (arr) {
  const randomIdx = Math.floor(Math.random() * arr.length)
  return arr[randomIdx]
}

module.exports = {
  getRandomItem
}
