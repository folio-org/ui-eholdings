import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValue from '@folio/stripes-components/lib/KeyValue';

export default function CustomerResourceShow({ customerResource }) {
  return (
    <div data-test-eholdings-customer-resource-show>
      <Paneset>
        <Pane defaultWidth="100%">
          {customerResource.isLoaded ? (
            <div>
              <h3 data-test-eholdings-customer-resource-show-vendor-name>
                <Link to={`/eholdings/vendors/${customerResource.customerResourcesList[0].vendorId}`}>{customerResource.customerResourcesList[0].vendorName}</Link>
              </h3>
              <h3 data-test-eholdings-customer-resource-show-package-name>
                <Link to={`/eholdings/vendors/${customerResource.customerResourcesList[0].vendorId}/packages/${customerResource.customerResourcesList[0].packageId}`}>{customerResource.customerResourcesList[0].packageName}</Link>
              </h3>
              <h1 data-test-eholdings-customer-resource-show-title-name>
                {customerResource.titleName}
              </h1>
              <div data-test-eholdings-customer-resource-show-selected>
                <KeyValue label="Selected" value={customerResource.customerResourcesList[0].isSelected ? 'Selected' : 'Not Selected'} />
              </div>
            </div>
          ) : customerResource.isErrored ? (
            customerResource.mapErrors((error, key) => (
              <p key={key} data-test-eholdings-customer-resource-show-error>
                {error.message}. {error.code}
              </p>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </Pane>
      </Paneset>
    </div>
  );
}

CustomerResourceShow.propTypes = {
  customerResource: PropTypes.object.isRequired
};
