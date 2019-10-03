import 'babel-polyfill';

import turnOffWarnings from './helpers/turn-off-warnings';

turnOffWarnings();
// require all modules ending in "-test" from the current directory and
// all subdirectories
const requireTest = require.context('./tests/', true, /-test/);
requireTest.keys().forEach(requireTest);
