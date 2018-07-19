import React from 'react';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes-components';
import styles from './publication-type.css';

export default function PublicationTypeField() {
  return (
    <div
      data-test-eholdings-publication-type-field
      className={styles['publication-type-field']}
    >
      <Field
        name="publicationType"
        component={Select}
        label="Publication type"
        dataOptions={[
          { value: 'Audio Book', label: 'Audio Book' },
          { value: 'Book', label: 'Book' },
          { value: 'Book Series', label: 'Book Series' },
          { value: 'Database', label: 'Database' },
          { value: 'Journal', label: 'Journal' },
          { value: 'Newsletter', label: 'Newsletter' },
          { value: 'Newspaper', label: 'Newspaper' },
          { value: 'Proceedings', label: 'Proceedings' },
          { value: 'Report', label: 'Report' },
          { value: 'Streaming Audio', label: 'Streaming Audio' },
          { value: 'Streaming Video', label: 'Streaming Video' },
          { value: 'Thesis/Dissertation', label: 'Thesis/Disseration' },
          { value: 'Unspecified', label: 'Unspecified' },
          { value: 'Web Site', label: 'Web Site' }
        ]}
      />
    </div>
  );
}
