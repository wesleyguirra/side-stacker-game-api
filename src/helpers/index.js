exports.checkWinner = (bArray, rows, columns, maxScore) => {
  //Horizontal
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns - (columns - maxScore); y++) {
      if (bArray[x][y]) {
        const results = []
        for (let s = 0; s < maxScore - 1; s++) {
          results[s] = bArray[x][y + s] === bArray[x][y + s + 1]
        }
        if (results.every(result => result === true)) {
          return bArray[x][y]
        }
      }
    }
  }
  //Vertical
  for (let y = 0; y < columns; y++) {
    for (let x = 0; x < rows - (rows - maxScore); x++) {
      if (bArray[x][y]) {
        const results = []
        for (let s = 0; s < maxScore - 1; s++) {
          results[s] = bArray[x + s][y] === bArray[x + s + 1][y]
        }
        if (results.every(result => result === true)) {
          return bArray[x][y]
        }
      }
    }
  }
  //Diagonal
  for (let x = 0; x < rows - (rows - maxScore); x++) {
    for (let y = 0; y < columns - (columns - maxScore); y++) {
      if (bArray[x][y]) {
        const results = []
        for (let s = 0; s < maxScore - 1; s++) {
          results[s] = bArray[x + s][y + s] === bArray[x + s + 1][y + s + 1]
        }
        if (results.every(result => result === true)) {
          return bArray[x][y]
        }
      }
    }
  }
  //Diagonal forward
  for (let x = rows - maxScore; x < rows; x++) {
    for (let y = 0; y < columns - maxScore; y++) {
      if (bArray[x][y]) {
        const results = []
        for (let s = 0; s < maxScore - 1; s++) {
          results[s] = bArray[x - s][y + s] === bArray[x - s - 1][y + s + 1]
        }
        if (results.every(result => result === true)) {
          return bArray[x][y]
        }
      }
    }
  }
}



/**
 *
 * @param bArray
 * @param rows
 * @param columns
 * @param maxScore
 * @return {*}
 */
exports.checkHorizontal = (bArray, rows, columns, maxScore, cb) => {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns - (columns - maxScore); y++) {
      if (bArray[x][y]) {
        const results = []
        for (let s = 0; s < maxScore - 1; s++) {
          results[s] = bArray[x][y + s] === bArray[x][y + s + 1]
        }
        if (results.every(result => result === true)) {
          cb(bArray[x][y])
        }
      }
    }
  }
}

/**
 *
 * @param bArray
 * @param rows
 * @param columns
 * @param maxScore
 * @return {*}
 */
exports.checkVertical = (bArray, rows, columns, maxScore, cb) => {

}

/**
 *
 * @param bArray
 * @param rows
 * @param columns
 * @param maxScore
 * @return {*}
 */
exports.checkDiagonal = (bArray, rows, columns, maxScore, cb) => {
  for (let x = 0; x < rows - (rows - maxScore); x++) {
    for (let y = 0; y < columns - (columns - maxScore); y++) {
      if (bArray[x][y]) {
        const results = []
        for (let s = 0; s < maxScore - 1; s++) {
          results[s] = bArray[x + s][y + s] === bArray[x + s + 1][y + s + 1]
        }
        if (results.every(result => result === true)) {
          cb(bArray[x][y])
        }
      }
    }
  }
}

/**
 *
 * @param bArray
 * @param rows
 * @param columns
 * @param maxScore
 * @return {*}
 */
exports.checkDiagonalForward = (bArray, rows, columns, maxScore, cb) => {

}

exports.getRandomInRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
