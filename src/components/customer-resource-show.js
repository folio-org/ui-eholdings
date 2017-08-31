import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from './key-value-label';

export default function CustomerResourceShow({ customerResource }) {
  return (
    <div data-test-eholdings-customer-resource-show>
      <Paneset>
        <Pane defaultWidth="100%">
          {customerResource ? (
            <div>
              <div style={{ margin: '2rem 0' }}>
                <KeyValueLabel label="Resource">
                  <h1 data-test-eholdings-customer-resource-show-title-name>
                    {customerResource.titleName}
                  </h1>
                </KeyValueLabel>
              </div>

              <KeyValueLabel label="Package">
                <div data-test-eholdings-customer-resource-show-package-name>
                  <Link to={`/eholdings/vendors/${customerResource.customerResourcesList[0].vendorId}/packages/${customerResource.customerResourcesList[0].packageId}`}>{customerResource.customerResourcesList[0].packageName}</Link>
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Content Type">
                <div data-test-eholdings-customer-resource-show-content-type>
                  {customerResource.customerResourcesList[0].contentType}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Vendor">
                <div data-test-eholdings-customer-resource-show-vendor-name>
                  <Link to={`/eholdings/vendors/${customerResource.customerResourcesList[0].vendorId}`}>{customerResource.customerResourcesList[0].vendorName}</Link>
                </div>
              </KeyValueLabel>

              <hr />

              <KeyValueLabel label="Selected">
                <div data-test-eholdings-customer-resource-show-selected>
                  {customerResource.customerResourcesList[0].isSelected ? 'Yes' : 'No'}
                </div>
              </KeyValueLabel>

              <hr />

              <div>
                <Link to={`/eholdings/titles/${customerResource.titleId}`}>
                  View all packages that include this title
                </Link>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Pane>
      </Paneset>
    </div>
  );
}

CustomerResourceShow.propTypes = {
  customerResource: PropTypes.object
};
