import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from '../key-value-label';
import List from '@folio/stripes-components/lib/List';
import styles from './vendor-show.css';

export default function VendorShow({ vendor, vendorPackages }) {
  const renderPackageListItem = item => (
    <li key={item.packageId} data-test-eholdings-vendor-package>
      <h5 data-test-eholdings-vendor-package-name>
        <Link to={`/eholdings/vendors/${vendor.vendorId}/packages/${item.packageId}`}>{item.packageName}</Link>
      </h5>
      <div>
        <span>{item.isSelected ? 'Selected' : 'Not Selected' }</span>
        &nbsp;&bull;&nbsp;
        <span data-test-eholdings-vendor-details-package-num-titles>{item.selectedCount}</span>
        &nbsp;/&nbsp;
        <span data-test-eholdings-vendor-details-package-num-titles-selected>{item.titleCount}</span>
        &nbsp;
        <span>{item.titleCount === 1 ? 'Title' : 'Titles'}</span>
      </div>
    </li>
  );

  return (
    <div data-test-eholdings-vendor-details>
      <Paneset>
        <Pane defaultWidth="100%">
          {vendor ? (
            <div>
              <div style={{ margin: '2rem 0' }}>
                <KeyValueLabel label="Vendor">
                  <h1 data-test-eholdings-vendor-details-name>
                    {vendor.vendorName}
                  </h1>
                </KeyValueLabel>
              </div>

              <KeyValueLabel label="Packages Selected">
                <div data-test-eholdings-vendor-details-packages-selected>
                  {vendor.packagesSelected}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Total Packages">
                <div data-test-eholdings-vendor-details-packages-total>
                  {vendor.packagesTotal}
                </div>
              </KeyValueLabel>

              <hr />
              {vendorPackages && vendorPackages.length ? (
                <div>
                  <h3>Packages</h3>
                  <List
                      itemFormatter={renderPackageListItem}
                      items={vendorPackages}
                      listClass={styles.list}/>
                </div>
              ) : vendorPackages ? (
                <p>No Packages Found</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Pane>
      </Paneset>
    </div>
  );
}

VendorShow.propTypes = {
  vendor: PropTypes.object,
  vendorPackages: PropTypes.arrayOf(PropTypes.object)
};
