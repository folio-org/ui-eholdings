/* global require */

let start = () => {};

if (process.env.NODE_ENV !== 'production') {
  start = require('./start').startDevMirage;
}

export default start;
