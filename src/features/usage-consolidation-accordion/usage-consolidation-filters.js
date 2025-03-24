import {
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Field,
} from 'react-final-form';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { defer } from 'lodash';

import {
  Select,
  Row,
  Col,
  Button,
  dayjs,
} from '@folio/stripes/components';

import { platformTypes } from '../../constants';

const propTypes = {
  initialState: PropTypes.shape({
    platformType: PropTypes.string,
    year: PropTypes.number,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const UsageConsolidationFilters = ({
  onSubmit,
  initialState,
}) => {
  const intl = useIntl();
  const yearField = useRef(null);

  useEffect(() => {
    if (yearField.current) {
      // use defer to avoid focus mismatch and set focus on select
      defer(() => yearField.current.focus());
    }
  }, [yearField]);

  const currentYear = dayjs().year();
  const last5Years = new Array(5)
    .fill(currentYear)
    .map((year, index) => year - index);

  const yearDataOptions = last5Years.map(year => ({
    label: year,
    value: year,
  }));
  const platformTypeDataOptions = Object.values(platformTypes).map(platformType => ({
    label: intl.formatMessage({ id: `ui-eholdings.settings.usageConsolidation.platformType.${platformType}` }),
    value: platformType,
  }));

  return (
    <Form
      initialValues={initialState}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <Row bottom="xs">
          <Col xs={3}>
            <Field
              inputRef={yearField}
              name="year"
              type="text"
              component={Select}
              dataOptions={yearDataOptions}
              label={intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.filters.year' })}
              data-test-usage-consolidation-year-filter
            />
          </Col>
          <Col xs={3}>
            <Field
              name="platformType"
              type="text"
              component={Select}
              dataOptions={platformTypeDataOptions}
              label={intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.filters.platformType' })}
              data-test-usage-consolidation-platform-type-filter
            />
          </Col>
          <Col xs={3}>
            <Button
              onClick={handleSubmit}
              data-test-usage-consolidation-view-button
            >
              <FormattedMessage id="ui-eholdings.usageConsolidation.filters.view" />
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  );
};

UsageConsolidationFilters.propTypes = propTypes;

export default UsageConsolidationFilters;
