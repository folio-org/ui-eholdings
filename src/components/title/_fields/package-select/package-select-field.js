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

function PackageSelectField({ options }) {
  const intl = useIntl();

  return (
    <div data-test-eholdings-package-select-field>
      <Field
        name="packageId"
        component={Selection}
        label={intl.formatMessage({ id: 'ui-eholdings.label.package' })}
        validate={validate}
        onBlur={null} // preventing validation that is in onBlur
        placeholder={<FormattedMessage id="ui-eholdings.title.chooseAPackage" />}
        dataOptions={options.filter(option => option.label && !option.disabled)}
        required
        tether={{
          constraints: [
            {
              to: 'window',
              attachment: 'together',
            }
          ]
        }}
      />
    </div>
  );
}

PackageSelectField.propTypes = {
  options: PropTypes.array.isRequired
};

export default PackageSelectField;
