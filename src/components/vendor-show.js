import React from 'react';
import PropTypes from 'prop-types';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from './key-value-label';
import List from './list';
import PackageListItem from './package-list-item';

export default function VendorShow({ vendor, vendorPackages }) {
  const record = vendor.content;

  return (
    <div data-test-eholdings-vendor-details>
      <Paneset>
        <Pane defaultWidth="100%">
          {vendor.isResolved ? (
            <div>
              <div style={{ margin: '2rem 0' }}>
                <KeyValueLabel label="Vendor">
                  <h1 data-test-eholdings-vendor-details-name>
                    {record.vendorName}
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
                    {vendorPackages.content.map((pkg) => (
                      <PackageListItem
                          key={pkg.packageId}
                          link={`/eholdings/vendors/${pkg.vendorId}/packages/${pkg.packageId}`}
                          showTitleCount
                          item={pkg}/>
                    ))}
                  </List>
                </div>
              ) : vendorPackages.isResolved ? (
                <p>No Packages Found</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          ) : vendor.isRejected ? (
            <p data-test-eholdings-vendor-details-error>
              {vendor.error.length ? vendor.error[0].message : vendor.error.message}
            </p>
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
