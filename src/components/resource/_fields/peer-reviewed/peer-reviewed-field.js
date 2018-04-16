import React from 'react';
import { Field } from 'redux-form';

import { Checkbox } from '@folio/stripes-components';
import styles from './peer-reviewed-field.css';

export default function PeerReviewedField() {
  return (
    <div
      data-test-eholdings-peer-reviewed-field
      className={styles['peer-reviewed-field']}
    >
      <Field
        name="isPeerReviewed"
        component={Checkbox}
        label="Peer reviewed"
      />
    </div>
  );
}
