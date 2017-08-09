import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import List from '@folio/stripes-components/lib/List';
import styles from './vendor-show.css';

export default function VendorShow({ vendor, vendorPackages }) {
  const renderPackageListItem = item => (
    <li key={item.packageId}>
      {item.packageName}
      {!!item.isSelected && (
        <div>SELECTED</div>
      )}
    </li>
  );

  return (
    <div data-test-eholdings-vendor-details>
      <Paneset>
        <Pane defaultWidth="100%">
          {vendor.isLoaded ? (
            <div>
              <h1 data-test-eholdings-vendor-details-name>
                {vendor.vendorName}
              </h1>
              <div data-test-eholdings-vendor-details-packages-total>
                <KeyValue label="Total Packages" value={vendor.packagesTotal} />
              </div>
              <div data-test-eholdings-vendor-details-packages-selected>
                <KeyValue label="Packages Selected" value={vendor.packagesSelected} />
              </div>
            </div>
          ) : vendor.isErrored ? (
            vendor.mapErrors((error, key) => (
              <p key={key} data-test-eholdings-vendor-details-error>
                {error.message}. {error.code}
              </p>
            ))
          ) : (
            <p>Loading...</p>
          )}

          {vendor.isLoaded && vendorPackages.isLoaded ? (
            <div>
              <h3>Packages</h3>
              <List
                itemFormatter={renderPackageListItem}
                items={vendorPackages.packageList}
                listClass={styles.list}
              />
            </div>
          ) : vendorPackages.isErrored ? (
            vendorPackages.mapErrors((error, key) => (
              <p key={key}>
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

VendorShow.propTypes = {
  vendor: PropTypes.object.isRequired,
  vendorPackages: PropTypes.object.isRequired
};
