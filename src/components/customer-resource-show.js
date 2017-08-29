import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from './key-value-label';

export default function CustomerResourceShow({ model, toggleSelected }) {
  return (
    <div data-test-eholdings-customer-resource-show>
      <Paneset>
        <Pane defaultWidth="100%">
          {model.isLoaded ? (
            <div>
              <div style={{ margin: '2rem 0' }}>
                <KeyValueLabel label="Resource">
                  <h1 data-test-eholdings-customer-resource-show-title-name>
                    {model.titleName}
                  </h1>
                </KeyValueLabel>
              </div>

              <KeyValueLabel label="Package">
                <div data-test-eholdings-customer-resource-show-package-name>
                  <Link to={`/eholdings/vendors/${model.vendorId}/packages/${model.packageId}`}>{model.packageName}</Link>
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Vendor">
                <div data-test-eholdings-customer-resource-show-vendor-name>
                  <Link to={`/eholdings/vendors/${model.vendorId}`}>{model.vendorName}</Link>
                </div>
              </KeyValueLabel>

              <hr />

              <KeyValueLabel label="Selected">
                <div data-test-eholdings-customer-resource-show-selected>
                  <input type="checkbox" onChange={toggleSelected} disabled={model.isTogglingSelection} checked={model.isSelected} />
                  {model.isSelected ? 'Yes' : 'No'}
                  {model.isTogglingSelection ? (
                    <span data-test-eholdings-customer-resource-show-is-selecting>...</span>) : ('')
                  }
                </div>
              </KeyValueLabel>

              <hr/>

              <div>
                <Link to={`/eholdings/titles/${model.titleId}`}>
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
  customerResource: PropTypes.object,
  saveSelected: PropTypes.func
};
