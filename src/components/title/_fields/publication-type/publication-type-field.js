import { Field } from 'react-final-form';

import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { publicationTypes } from '../../../../constants';

const PublicationTypeField = () => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'ui-eholdings.title.publicationType' });

  return (
    <div data-test-eholdings-publication-type-field>
      <Field
        name="publicationType"
        component={Select}
        label={label}
        data-testid="publication-type-field"
      >
        {Object.keys(publicationTypes).map((publicationType) => {
          const optionLabel = intl.formatMessage({ id: `ui-eholdings.filter.pubType.${publicationType.toLowerCase()}` });
          const value = publicationTypes[publicationType];

          return <option key={value} value={value}>{optionLabel}</option>;
        })}
      </Field>
    </div>
  );
};

export default PublicationTypeField;
