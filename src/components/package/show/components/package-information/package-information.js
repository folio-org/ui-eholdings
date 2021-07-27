import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';

import {
  Accordion,
  Headline,
  KeyValue,
  Row,
  Col,
} from '@folio/stripes/components';

import InternalLink from '../../../../internal-link';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const PackageInformation = ({
  isOpen,
  model,
  onToggle,
}) => (
  <Accordion
    label={(
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id="ui-eholdings.label.packageInformation" />
      </Headline>
    )}
    open={isOpen}
    id="packageShowInformation"
    onToggle={onToggle}
  >
    <Row>
      <Col xs={4}>
        <KeyValue label={<FormattedMessage id="ui-eholdings.package.provider" />}>
          <div data-test-eholdings-package-details-provider>
            <InternalLink to={`/eholdings/providers/${model.providerId}`}>
              {model.providerName}
            </InternalLink>
          </div>
        </KeyValue>
      </Col>

      {
        model.contentType && (
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-eholdings.package.contentType" />}>
              <div
                data-test-eholdings-package-details-content-type
                data-testid="package-details-content-type"
              >
                {model.contentType}
              </div>
            </KeyValue>
          </Col>
        )
      }

      {
        model.packageType && (
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-eholdings.package.packageType" />}>
              <div
                data-test-eholdings-package-details-type
                data-testid="package-details-type"
              >
                {model.packageType}
              </div>
            </KeyValue>
          </Col>
        )
      }
    </Row>
    <Row>
      <Col xs={4}>
        <KeyValue label={<FormattedMessage id="ui-eholdings.package.titlesSelected" />}>
          <div
            data-test-eholdings-package-details-titles-selected
            data-testid="package-details-titles-selected"
          >
            <FormattedNumber value={model.selectedCount} />
          </div>
        </KeyValue>
      </Col>

      <Col xs={4}>
        <KeyValue label={<FormattedMessage id="ui-eholdings.package.totalTitles" />}>
          <div
            data-test-eholdings-package-details-titles-total
            data-testid="package-details-titles-total"
          >
            <FormattedNumber value={model.titleCount} />
          </div>
        </KeyValue>
      </Col>
    </Row>
  </Accordion>
);

PackageInformation.propTypes = propTypes;

export default PackageInformation;
