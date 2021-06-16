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
        aria-label={label}
        data-testid="publication-type-field"
      >
        {Object.values(publicationTypes).map((publicationType) => {
          const value = intl.formatMessage({ id: `ui-eholdings.filter.pubType.${publicationType}` });

          return <option key={value} value={value}>{value}</option>;
        })}
      </Field>
    </div>
  );
};

export default PublicationTypeField;
