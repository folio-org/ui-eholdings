import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';

import {
  Accordion,
  Headline,
  KeyValue,
} from '@folio/stripes/components';

import KeyValueColumns from '../../../../key-value-columns';
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
    <KeyValueColumns>
      <KeyValue label={<FormattedMessage id="ui-eholdings.package.provider" />}>
        <div data-test-eholdings-package-details-provider>
          <InternalLink to={`/eholdings/providers/${model.providerId}`}>
            {model.providerName}
          </InternalLink>
        </div>
      </KeyValue>

      {
        model.contentType && (
          <KeyValue label={<FormattedMessage id="ui-eholdings.package.contentType" />}>
            <div
              data-test-eholdings-package-details-content-type
              data-testid="package-details-content-type"
            >
              {model.contentType}
            </div>
          </KeyValue>
        )
      }

      {
        model.packageType && (
          <KeyValue label={<FormattedMessage id="ui-eholdings.package.packageType" />}>
            <div
              data-test-eholdings-package-details-type
              data-testid="package-details-type"
            >
              {model.packageType}
            </div>
          </KeyValue>
        )
      }

      <KeyValue label={<FormattedMessage id="ui-eholdings.package.titlesSelected" />}>
        <div
          data-test-eholdings-package-details-titles-selected
          data-testid="package-details-titles-selected"
        >
          <FormattedNumber value={model.selectedCount} />
        </div>
      </KeyValue>

      <KeyValue label={<FormattedMessage id="ui-eholdings.package.totalTitles" />}>
        <div
          data-test-eholdings-package-details-titles-total
          data-testid="package-details-titles-total"
        >
          <FormattedNumber value={model.titleCount} />
        </div>
      </KeyValue>
    </KeyValueColumns>
  </Accordion>
);

PackageInformation.propTypes = propTypes;

export default PackageInformation;
