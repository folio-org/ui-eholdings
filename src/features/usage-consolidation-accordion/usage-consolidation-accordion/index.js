import { connect } from 'react-redux';
import { selectPropFromData } from '../../../redux/selectors';
import { getUsageConsolidation as getUsageConsolidationAction } from '../../../redux/actions';

import UsageConsolidationAccordion from './usage-consolidation-accordion';

export default connect(
  (store) => ({
    usageConsolidation: selectPropFromData(store, 'usageConsolidation'),
  }), {
    getUsageConsolidation: getUsageConsolidationAction,
  }
)(UsageConsolidationAccordion);
