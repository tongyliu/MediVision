/*
 * text-utils.js
 *
 * Utility methods for manipulating strings
 */

module.exports = {
  getFirstName: function(name) {
    return name.split(' ')[0];
  },

  getInitials: function(name) {
    var parts = name.split(' ');
    var initials = '';
    for (var i = 0; i < parts.length; ++i) {
      initials += parts[i][0];
    }
    return initials;
  }
};
