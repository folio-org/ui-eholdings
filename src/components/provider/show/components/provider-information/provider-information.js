import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedNumber,
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
  Headline,
  KeyValue,
} from '@folio/stripes/components';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  packagesSelected: PropTypes.number.isRequired,
  packagesTotal: PropTypes.number.isRequired,
};

const ProviderInformation = ({
  isOpen,
  onToggle,
  packagesSelected,
  packagesTotal,
}) => (
  <Accordion
    label={(
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id="ui-eholdings.provider.providerInformation" />
      </Headline>
    )}
    open={isOpen}
    id="providerShowProviderInformation"
    onToggle={onToggle}
  >
    <KeyValue label={<FormattedMessage id="ui-eholdings.provider.packagesSelected" />}>
      <div
        data-test-eholdings-provider-details-packages-selected
        data-testid="provider-details-packages-selected"
      >
        <FormattedNumber value={packagesSelected} />
      </div>
    </KeyValue>

    <KeyValue label={<FormattedMessage id="ui-eholdings.provider.totalPackages" />}>
      <div
        data-test-eholdings-provider-details-packages-total
        data-testid="provider-details-packages-total"
      >
        <FormattedNumber value={packagesTotal} />
      </div>
    </KeyValue>
  </Accordion>
);

ProviderInformation.propTypes = propTypes;

export default ProviderInformation;
