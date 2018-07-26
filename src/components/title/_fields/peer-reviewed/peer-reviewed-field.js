import React from 'react';
import { Field } from 'redux-form';

import { Checkbox } from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';
import styles from './peer-reviewed-field.css';

function PeerReviewedField({ intl }) {
  return (
    <div
      data-test-eholdings-peer-reviewed-field
      className={styles['peer-reviewed-field']}
    >
      <Field
        name="isPeerReviewed"
        component={Checkbox}
        label={intl.formatMessage({ id: 'ui-eholdings.title.peerReviewed' })}
      />
    </div>
  );
}

PeerReviewedField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(PeerReviewedField);
