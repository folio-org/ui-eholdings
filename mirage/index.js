/* global require */

let start = () => {};

if (process.env.NODE_ENV !== 'production') {
  start = require('./start').default;
}

export default start;
