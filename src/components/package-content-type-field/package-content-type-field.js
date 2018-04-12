import React, { Component } from 'react';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes-components';
import styles from './package-content-type-field.css';

export default class PackageContentTypeField extends Component {
  render() {
    return (
      <div
        data-test-eholdings-package-content-type-field
        className={styles['package-content-type-field']}
      >
        <Field
          name="contentType"
          component={Select}
          label="Content type"
          dataOptions={[
            { value: 'Aggregated Full Text', label: 'Aggregated Full Text' },
            { value: 'Abstract and Index', label: 'Abstract and Index' },
            { value: 'E-Book', label: 'E-Book' },
            { value: 'E-Journal', label: 'E-Journal' },
            { value: 'Print', label: 'Print' },
            { value: 'Online Reference', label: 'Online Reference' },
            { value: 'Unknown', label: 'Unknown' }
          ]}
        />
      </div>
    );
  }
}
