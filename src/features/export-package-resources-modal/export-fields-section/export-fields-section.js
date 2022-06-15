import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  MultiSelection,
  RadioButton,
  RadioButtonGroup,
  Layout,
  Label,
} from '@folio/stripes/components';

const propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  sectionState: PropTypes.shape({
    allSelected: PropTypes.bool.isRequired,
    selectedFields: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

const ExportFieldsSection = ({
  id,
  title,
  options,
  name,
  onChange,
  sectionState,
}) => {
  const intl = useIntl();

  const handleRadioChange = (allSelected) => {
    onChange({ ...sectionState, allSelected });
  };

  const handleSelectChange = (selectedFields) => {
    onChange({ selectedFields, allSelected: false });
  };

  return (
    <>
      <Label>
        <strong>{title}</strong>
      </Label>
      <Layout
        className="display-flex flex-align-items-start"
      >
        <Layout
          className="padding-end-gutter"
        >
          <RadioButtonGroup>
            <RadioButton
              aria-label={intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.fields.all' })}
              name={name}
              checked={sectionState.allSelected}
              onChange={() => handleRadioChange(true)}
            />
            <RadioButton
              id={`selected-${id}`}
              aria-label={intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.fields.selected' })}
              name={name}
              checked={!sectionState.allSelected}
              onChange={() => handleRadioChange(false)}
            />
          </RadioButtonGroup>
        </Layout>
        <Layout data-test-order-labels>
          <Label>
            {intl.formatMessage({ id: 'ui-eholdings.exportPackageResources.all' })}
          </Label>
          <MultiSelection
            aria-labelledby={`selected-${id}`}
            dataOptions={options}
            marginBottom0
            onChange={handleSelectChange}
            value={sectionState.selectedFields}
          />
        </Layout>
      </Layout>
    </>
  );
};

ExportFieldsSection.propTypes = propTypes;

export default ExportFieldsSection;
