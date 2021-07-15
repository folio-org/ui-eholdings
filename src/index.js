import { hot } from 'react-hot-loader';
import { withConnect } from '@folio/stripes/connect';

import EHoldings from './eholdings';

export default hot(module)(withConnect(EHoldings));
