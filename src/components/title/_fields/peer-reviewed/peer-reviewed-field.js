import { Field } from 'react-final-form';

import {
  useIntl,
} from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import styles from './peer-reviewed-field.css';

const PeerReviewedField = () => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'ui-eholdings.title.peerReviewed' });

  return (
    <div
      data-test-eholdings-peer-reviewed-field
      className={styles['peer-reviewed-field']}
    >
      <Field
        name="isPeerReviewed"
        component={Checkbox}
        label={label}
        aria-label={label}
        type="checkbox"
        data-testid="peer-reviewed-field"
      />
    </div>
  );
};

export default PeerReviewedField;
