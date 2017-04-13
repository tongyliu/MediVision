/*
 * color-mapper.js
 *
 * Keeps track of a random, global mapping from unique keys to colors
 */

var _ = require('lodash');

class _ColorMapper {
  constructor() {
    this.mapping = {};
    this.colors = _.shuffle(['red', 'green', 'blue', 'cyan', 'yellow']);
    this.currIdx = 0;
  }

  colorFor(key) {
    if (!this.mapping[key]) {
      this.mapping[key] = this.colors[this.currIdx];
      this.currIdx = (this.currIdx + 1) % this.colors.length;
    }
    return this.mapping[key];
  }
}

var ColorMapper = new _ColorMapper();

module.exports = ColorMapper;
