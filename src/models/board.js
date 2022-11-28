'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Board.belongsTo(models.Room);
    }
  }

  Board.init({
    columns: DataTypes.INTEGER,
    rows: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    values: DataTypes.ARRAY(DataTypes.ARRAY({type: DataTypes.STRING, allowNull: true})),
  }, {
    sequelize,
    modelName: 'Board',
  });

  Board.prototype.updateValues = function(x, y, value) {
    try {
      console.log(x, y)
      if (!!this.values[x][y]) return Promise.resolve(this)

      const isFirst = y === 0
      const isLast = y === this.values[x].length - 1
      const hasSibling = (this.values[x][y - 1] !== null || this.values[x][y + 1] !== null)
      const canChoosePosition = (isFirst || isLast || hasSibling)
      if (canChoosePosition) {
        const updatedBoardArray = Array.from(this.values)
        updatedBoardArray[x][y] = value
        //Alternate turns
        return updatedBoardArray
      }
      return this.values;
    } catch (e) {
      console.error(e)
    }
  }
  
  Board.prototype.checkWinner = function() {
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.columns - (this.columns - this.score); y++) {
        if (this.values[x][y]) {
          const results = []
          for (let s = 0; s < this.score - 1; s++) {
            results[s] = this.values[x][y + s] === this.values[x][y + s + 1]
          }
          if (results.every(result => result === true)) {
            return this.values[x][y]
          }
        }
      }
    }
    //Vertical
    for (let y = 0; y < this.columns; y++) {
      for (let x = 0; x < this.rows - (this.rows - this.score); x++) {
        if (this.values[x][y]) {
          const results = []
          for (let s = 0; s < this.score - 1; s++) {
            results[s] = this.values[x + s][y] === this.values[x + s + 1][y]
          }
          if (results.every(result => result === true)) {
            return this.values[x][y]
          }
        }
      }
    }
    //Diagonal
    for (let x = 0; x < this.rows - (this.rows - this.score); x++) {
      for (let y = 0; y < this.columns - (this.columns - this.score); y++) {
        if (this.values[x][y]) {
          const results = []
          for (let s = 0; s < this.score - 1; s++) {
            results[s] = this.values[x + s][y + s] === this.values[x + s + 1][y + s + 1]
          }
          if (results.every(result => result === true)) {
            return this.values[x][y]
          }
        }
      }
    }
    //Diagonal forward
    for (let x = this.rows - this.score; x < this.rows; x++) {
      for (let y = 0; y < this.columns - this.score; y++) {
        if (this.values[x][y]) {
          const results = []
          for (let s = 0; s < this.score - 1; s++) {
            results[s] = this.values[x - s][y + s] === this.values[x - s - 1][y + s + 1]
          }
          if (results.every(result => result === true)) {
            return this.values[x][y]
          }
        }
      }
    }
  }
  return Board;
}