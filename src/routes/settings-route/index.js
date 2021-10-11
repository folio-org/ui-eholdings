import { connect } from 'react-redux';
import SettingsRoute from './settings-route';
import { getKbCredentials } from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';

export default connect(
  (store) => ({
    kbCredentials: selectPropFromData(store, 'kbCredentials'),
  }), {
    getKbCredentials,
  }
)(SettingsRoute);
