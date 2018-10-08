import React from 'react';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes/components';
import { injectIntl, intlShape } from 'react-intl';

function PublicationTypeField({ intl }) {
  return (
    <div data-test-eholdings-publication-type-field>
      <Field
        name="publicationType"
        component={Select}
        label={intl.formatMessage({ id: 'ui-eholdings.title.publicationType' })}
        dataOptions={[
          { value: 'Audio Book', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.audioBook' }) },
          { value: 'Book', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.book' }) },
          { value: 'Book Series', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.bookSeries' }) },
          { value: 'Database', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.database' }) },
          { value: 'Journal', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.journal' }) },
          { value: 'Newsletter', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.newsletter' }) },
          { value: 'Newspaper', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.newspaper' }) },
          { value: 'Proceedings', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.proceedings' }) },
          { value: 'Report', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.report' }) },
          { value: 'Streaming Audio', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.streamingAudio' }) },
          { value: 'Streaming Video', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.streamingVideo' }) },
          { value: 'Thesis/Dissertation', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.thesisdissertation' }) },
          { value: 'Unspecified', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.unspecified' }) },
          { value: 'Web Site', label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.website' }) }
        ]}
      />
    </div>
  );
}

PublicationTypeField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(PublicationTypeField);
