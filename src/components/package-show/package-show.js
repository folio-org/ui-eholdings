import React from 'react';
import PropTypes from 'prop-types';

export default function PackageShow({ vendorPackage }) {
  return (
    <div data-test-eholdings-package-details>
      {vendorPackage.isLoaded ? (
        <div>
          <h3 data-test-eholdings-package-details-vendor>
            Return to Vendor...
          </h3>
          <br/>
          <h1 data-test-eholdings-package-details-name>
            {vendorPackage.packageName}
          </h1>
          <p>
            Content Type: <span data-test-eholdings-package-details-content-type>{vendorPackage.contentType}</span>
          </p>
          <p>
            Selected: <input type='checkbox' checked={vendorPackage.isSelected} disabled data-test-eholdings-package-details-selected />
          </p>
          <p>
            Total Titles: <span data-test-eholdings-package-details-titles-total>{vendorPackage.titleCount}</span>
          </p>
          <p>
            Selected Titles: <span data-test-eholdings-package-details-titles-selected>{vendorPackage.selectedCount}</span>
          </p>
        </div>
      ) : vendorPackage.isErrored ? (
        vendorPackage.mapErrors((error, key) => (
          <p key={key} data-test-eholdings-package-details-error>
            {error.message}. {error.code}
          </p>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

PackageShow.propTypes = {
  vendorPackage: PropTypes.object.isRequired
};
