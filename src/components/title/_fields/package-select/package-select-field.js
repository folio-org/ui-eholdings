import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { Selection } from '@folio/stripes/components';

function validate(value) {
  return value ? undefined : <FormattedMessage id="ui-eholdings.validate.errors.packageSelect.required" />;
}

const PackageSelectField = ({ options }) => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'ui-eholdings.label.package' });

  return (
    <div data-test-eholdings-package-select-field>
      <Field
        name="packageId"
        component={Selection}
        label={label}
        ariaLabel={label}
        validate={validate}
        onBlur={null} // preventing validation that is in onBlur
        placeholder={<FormattedMessage id="ui-eholdings.title.chooseAPackage" />}
        dataOptions={options.filter(option => option.label && !option.disabled)}
        required
        data-testid="package-select-field"
        tether={{
          constraints: [
            {
              to: 'window',
              attachment: 'together',
            },
          ],
        }}
      />
    </div>
  );
};

PackageSelectField.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};

export default PackageSelectField;
