import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import debounce from 'lodash/debounce';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Selection,
  Icon,
} from '@folio/stripes/components';

function validate(value) {
  return value ? undefined : <FormattedMessage id="ui-eholdings.validate.errors.packageSelect.required" />;
}

const FILTER_DEBOUNCE_MS = 1000;

const PackageSelectField = ({
  options,
  onFilter,
  loadingOptions,
}) => {
  const intl = useIntl();
  const onFilterDebounced = debounce(onFilter, FILTER_DEBOUNCE_MS);

  const label = intl.formatMessage({ id: 'ui-eholdings.label.package' });

  const handleFilter = (value) => {
    onFilterDebounced(value);
    return options;
  };

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
        onFilter={handleFilter}
        data-testid="package-select-field"
        loading={loadingOptions}
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
  loadingOptions: PropTypes.bool,
  onFilter: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};

export default PackageSelectField;
