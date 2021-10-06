import { connect } from 'react-redux';

import CustomLabelsRoute from './custom-labels-route';
import {
  getCustomLabels as getCustomLabelsAction,
  updateCustomLabels as updateCustomLabelsAction,
  confirmUpdateCustomLabels as confirmUpdateAction,
} from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';

export default connect(
  store => ({
    customLabels: selectPropFromData(store, 'customLabels'),
  }), {
    getCustomLabels: getCustomLabelsAction,
    updateCustomLabels: updateCustomLabelsAction,
    confirmUpdate: confirmUpdateAction,
  }
)(CustomLabelsRoute);
