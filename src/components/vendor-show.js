import React from 'react';
import PropTypes from 'prop-types';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from './key-value-label';
import List from './list';
import PackageListItem from './package-list-item';

export default function VendorShow({ vendor, vendorPackages }) {
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
                  <List>
                    {vendorPackages.map((pkg) => (
                      <PackageListItem
                          key={pkg.packageId}
                          link={`/eholdings/vendors/${pkg.vendorId}/packages/${pkg.packageId}`}
                          showTitleCount
                          item={pkg}/>
                    ))}
                  </List>
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
