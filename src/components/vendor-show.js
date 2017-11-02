import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@folio/stripes-components/lib/Icon';
import KeyValueLabel from './key-value-label';
import List from './list';
import PackageListItem from './package-list-item';

export default function VendorShow({ vendor, vendorPackages }) {
  const record = vendor.content;

  return (
    <div style={{ padding: '0 1rem' }} data-test-eholdings-vendor-details>
      {vendor.isResolved ? (
        <div>
          <div style={{ margin: '2rem 0' }}>
            <KeyValueLabel label="Vendor">
              <h1 data-test-eholdings-vendor-details-name>
                {record.name}
              </h1>
            </KeyValueLabel>
          </div>

          <KeyValueLabel label="Packages Selected">
            <div data-test-eholdings-vendor-details-packages-selected>
              {record.packagesSelected}
            </div>
          </KeyValueLabel>

          <KeyValueLabel label="Total Packages">
            <div data-test-eholdings-vendor-details-packages-total>
              {record.packagesTotal}
            </div>
          </KeyValueLabel>

          <hr />
          {vendorPackages.isResolved && vendorPackages.content.length ? (
            <div>
              <h3>Packages</h3>
              <List>
                {vendorPackages.content.map(pkg => (
                  <PackageListItem
                    key={pkg.packageId}
                    link={`/eholdings/vendors/${pkg.vendorId}/packages/${pkg.packageId}`}
                    showTitleCount
                    item={pkg}
                  />
                ))}
              </List>
            </div>
          ) : vendorPackages.isResolved ? (
            <p>No Packages Found</p>
          ) : (
            <Icon icon="spinner-ellipsis" />
          )}
        </div>
      ) : vendor.isRejected ? (
        <p data-test-eholdings-vendor-details-error>
          {vendor.error.errors.length ? vendor.error.errors[0].title : vendor.error.title}
        </p>
      ) : (
        <Icon icon="spinner-ellipsis" />
      )}
    </div>
  );
}

VendorShow.propTypes = {
  vendor: PropTypes.object.isRequired,
  vendorPackages: PropTypes.object.isRequired
};
