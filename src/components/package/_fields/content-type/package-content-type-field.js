import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';

import { Select } from '@folio/stripes/components';

import { contentTypes } from '../../../../constants';

const PackageContentTypeField = () => {
  const { formatMessage } = useIntl();

  return (
    <div data-test-eholdings-package-content-type-field>
      <Field
        name="contentType"
        component={Select}
        label="Content type"
        data-testid="contentType"
      >
        {Object.keys(contentTypes).map((contentType) => {
          const label = formatMessage({ id: `ui-eholdings.filter.contentType.${contentType.toLowerCase()}` });
          const value = contentTypes[contentType];

          return (<option key={value} value={value}>{label}</option>);
        })}
      </Field>
    </div>
  );
};

export default PackageContentTypeField;
