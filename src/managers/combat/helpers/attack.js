export default {
  getAttacks(bf) {
    var {width, height} = bf
    var {x, y} = bf.player.getPos() 

    var positions = []

    if (x > 0) {
      positions.push({ x: x - 1, y})
    }

    if (x < width - 1) {
      positions.push({ x: x + 1, y})
    }

    if (y > 0) {
      positions.push({ y: y - 1, x})
    }

    if (y < height - 1) {
      positions.push({ y: y + 1, x})
    }

    return positions
  }
}