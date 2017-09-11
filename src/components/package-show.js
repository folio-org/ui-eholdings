import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from './key-value-label';
import List from './list';
import TitleListItem from './title-list-item';

export default function PackageShow({ vendorPackage, packageTitles }, { intl }) {
  let formatISODateWithoutTime = function(dateString) {
    let [year, month, day]= dateString.split('-');
    let dateObj = new Date();
    dateObj.setFullYear(year);
    dateObj.setMonth(parseInt(month, 10) - 1);
    dateObj.setDate(day);
    return intl.formatDate(dateObj);
  };

  return (
    <div data-test-eholdings-package-details>
      <Paneset>
        <Pane defaultWidth="100%">
          {vendorPackage ? (
            <div>
              <div style={{ margin: '2rem 0' }}>
                <KeyValueLabel label="Package">
                  <h1 data-test-eholdings-package-details-name>
                    {vendorPackage.packageName}
                  </h1>
                </KeyValueLabel>
              </div>

              <KeyValueLabel label="Vendor">
                <div data-test-eholdings-package-details-vendor>
                  <Link to={`/eholdings/vendors/${vendorPackage.vendorId}`}>{vendorPackage.vendorName}</Link>
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Content Type">
                <div data-test-eholdings-package-details-content-type>
                  {vendorPackage.contentType}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Titles Selected">
                <div data-test-eholdings-package-details-titles-selected>
                  {vendorPackage.selectedCount}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Total Titles">
                <div data-test-eholdings-package-details-titles-total>
                  {vendorPackage.titleCount}
                </div>
              </KeyValueLabel>

              {(vendorPackage.customCoverage.beginCoverage || vendorPackage.customCoverage.endCoverage) && (
                <KeyValueLabel label="Custom Coverage">
                  <div data-test-eholdings-package-details-custom-coverage>
                    {formatISODateWithoutTime(vendorPackage.customCoverage.beginCoverage)} - {formatISODateWithoutTime(vendorPackage.customCoverage.endCoverage)}
                  </div>
                </KeyValueLabel>
              )}

              <hr />

              <KeyValueLabel label="Selected">
                <div data-test-eholdings-package-details-selected>
                  {vendorPackage.isSelected ? 'Yes' : 'No'}
                </div>
              </KeyValueLabel>

              <hr />

              {vendorPackage.visibilityData.isHidden && (
                <div data-test-eholdings-package-details-is-hidden>
                <p><strong>This package is hidden.</strong></p>
                <p><em>{vendorPackage.visibilityData.reason}</em></p>
                <hr />
                </div>
              )}

              {packageTitles && packageTitles.length ? (
                <div>
                  <h3>Titles</h3>
                  <List data-test-eholdings-package-details-title-list>
                    {packageTitles.map(item => (
                      <TitleListItem
                        key={item.titleId}
                        item={item}
                        link={`/eholdings/vendors/${vendorPackage.vendorId}/packages/${vendorPackage.packageId}/titles/${item.titleId}`}
                        showSelected/>
                    ))}
                  </List>
                </div>
              ) : packageTitles ? (
                <p>No Titles Found</p>
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

PackageShow.propTypes = {
  vendorPackage: PropTypes.object,
  packageTitles: PropTypes.arrayOf(PropTypes.object)
};

PackageShow.contextTypes = {
  intl: PropTypes.object
};
