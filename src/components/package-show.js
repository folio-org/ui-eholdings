import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from './key-value-label';
import List from './list';
import TitleListItem from './title-list-item';

export default function PackageShow({ vendorPackage, packageTitles }, { intl }) {
  let packageRecord = vendorPackage.content;

  let formatISODateWithoutTime = (dateString) => {
    let [year, month, day] = dateString.split('-');
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
          {vendorPackage.isResolved ? (
            <div>
              <div style={{ margin: '2rem 0' }}>
                <KeyValueLabel label="Package">
                  <h1 data-test-eholdings-package-details-name>
                    {packageRecord.packageName}
                  </h1>
                </KeyValueLabel>
              </div>

              <KeyValueLabel label="Vendor">
                <div data-test-eholdings-package-details-vendor>
                  <Link to={`/eholdings/vendors/${packageRecord.vendorId}`}>{packageRecord.vendorName}</Link>
                </div>
              </KeyValueLabel>

              {packageRecord.contentType && (
                <KeyValueLabel label="Content Type">
                  <div data-test-eholdings-package-details-content-type>
                    {packageRecord.contentType}
                  </div>
                </KeyValueLabel>
              ) }

              <KeyValueLabel label="Titles Selected">
                <div data-test-eholdings-package-details-titles-selected>
                  {packageRecord.selectedCount}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Total Titles">
                <div data-test-eholdings-package-details-titles-total>
                  {packageRecord.titleCount}
                </div>
              </KeyValueLabel>

              {(packageRecord.customCoverage.beginCoverage || packageRecord.customCoverage.endCoverage) && (
                <KeyValueLabel label="Custom Coverage">
                  <div data-test-eholdings-package-details-custom-coverage>
                    {formatISODateWithoutTime(packageRecord.customCoverage.beginCoverage)} - {formatISODateWithoutTime(packageRecord.customCoverage.endCoverage)}
                  </div>
                </KeyValueLabel>
              )}

              <hr />

              <KeyValueLabel label="Selected">
                <div data-test-eholdings-package-details-selected>
                  {packageRecord.isSelected ? 'Yes' : 'No'}
                </div>
              </KeyValueLabel>

              <hr />

              {packageRecord.visibilityData.isHidden && (
                <div data-test-eholdings-package-details-is-hidden>
                  <p><strong>This package is hidden.</strong></p>
                  <p><em>{packageRecord.visibilityData.reason}</em></p>
                  <hr />
                </div>
              )}

              {packageTitles.isResolved && packageTitles.content.length ? (
                <div>
                  <h3>Titles</h3>
                  <List data-test-eholdings-package-details-title-list>
                    {packageTitles.content.map(item => (
                      <TitleListItem
                        key={item.titleId}
                        item={item}
                        link={`/eholdings/vendors/${packageRecord.vendorId}/packages/${packageRecord.packageId}/titles/${item.titleId}`}
                        showSelected
                      />
                    ))}
                  </List>
                </div>
              ) : packageTitles.isResolved ? (
                <p>No Titles Found</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          ) : vendorPackage.isRejected ? (
            <p data-test-eholdings-package-details-error>
              {vendorPackage.error.length ? vendorPackage.error[0].message : vendorPackage.error.message}
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </Pane>
      </Paneset>
    </div>
  );
}

PackageShow.propTypes = {
  vendorPackage: PropTypes.object.isRequired,
  packageTitles: PropTypes.object.isRequired
};

PackageShow.contextTypes = {
  intl: PropTypes.object
};
