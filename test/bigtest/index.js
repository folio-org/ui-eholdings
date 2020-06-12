import 'babel-polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import turnOffWarnings from './helpers/turn-off-warnings';
import './helpers/monkey-patch-run';

Enzyme.configure({ adapter: new Adapter() });

turnOffWarnings();
// require all modules ending in "-test" from the current directory and
// all subdirectories
const requireSrcTests = require.context('../../src', true, /-test/);
const requireTest = require.context('./tests/', true, /-test/);
requireTest.keys().forEach(requireTest);
requireSrcTests.keys().forEach(requireSrcTests);
