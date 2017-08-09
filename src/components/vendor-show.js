import React from 'react';
import PropTypes from 'prop-types';

export default function VendorShow({ vendor }) {
  return (
    <div data-test-eholdings-vendor-details>
      {vendor.isLoaded ? (
        <div>
          <h1 data-test-eholdings-vendor-details-name>
            {vendor.vendorName}
          </h1>
          <p>
            Total Packages: <span data-test-eholdings-vendor-details-packages-total>{vendor.packagesTotal}</span>
          </p>
          <p>
            Selected Packages: <span data-test-eholdings-vendor-details-packages-selected>{vendor.packagesSelected}</span>
          </p>
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
    </div>
  );
}

VendorShow.propTypes = {
  vendor: PropTypes.object.isRequired
};
