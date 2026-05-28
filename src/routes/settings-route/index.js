import { connect } from 'react-redux';
import SettingsRoute from './settings-route';
import { selectPropFromData } from '../../redux/selectors';

export default connect(
  (store) => ({
    kbCredentials: selectPropFromData(store, 'kbCredentials'),
  })
)(SettingsRoute);
