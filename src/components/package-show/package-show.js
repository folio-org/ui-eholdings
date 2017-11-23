import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@folio/stripes-components/lib/Icon';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';

import Link from '../link';
import KeyValueLabel from '../key-value-label';
import List from '../list';
import TitleListItem from '../title-list-item';
import ToggleSwitch from '../toggle-switch';
import { formatISODateWithoutTime } from '../utilities';
import styles from './package-show.css';

export default function PackageShow({
  vendorPackage,
  packageTitles,
  toggleRequest,
  toggleSelected
}, { intl, router }) {
  let packageRecord = vendorPackage.content;
  const historyState = router.history.location.state;
  const queryString = router.history.location.search;

  return (
    <div>
      { !queryString && (
        <PaneHeader
          firstMenu={historyState && historyState.eholdings && (
            <PaneMenu>
              <button data-test-eholdings-package-details-back-button onClick={() => router.history.goBack()}><Icon icon="left-arrow" /></button>
            </PaneMenu>
          )}
        />
      )}
      <div className={styles['detail-container']} data-test-eholdings-package-details>
        {vendorPackage.isResolved ? (
          <div>
            <div className={styles['detail-container-header']}>
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
                  {formatISODateWithoutTime(packageRecord.customCoverage.beginCoverage, intl)} - {formatISODateWithoutTime(packageRecord.customCoverage.endCoverage, intl)}
                </div>
              </KeyValueLabel>
            )}

            <hr />

            <label
              data-test-eholdings-package-details-selected
              htmlFor="package-details-toggle-switch"
            >
              <h4>{packageRecord.isSelected ? 'Selected' : 'Not Selected'}</h4>
              <ToggleSwitch
                onChange={toggleSelected}
                disabled={toggleRequest.isPending}
                checked={packageRecord.isSelected}
                isPending={toggleRequest.isPending}
                id="package-details-toggle-switch"
              />
            </label>

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
              <Icon icon="spinner-ellipsis" />
            )}
          </div>
        ) : vendorPackage.isRejected ? (
          <p data-test-eholdings-package-details-error>
            {vendorPackage.error.length ? vendorPackage.error[0].message : vendorPackage.error.message}
          </p>
        ) : (
          <Icon icon="spinner-ellipsis" />
        )}
      </div>
    </div>
  );
}

PackageShow.propTypes = {
  vendorPackage: PropTypes.object.isRequired,
  packageTitles: PropTypes.object.isRequired,
  toggleRequest: PropTypes.object.isRequired,
  toggleSelected: PropTypes.func.isRequired,
};

PackageShow.contextTypes = {
  intl: PropTypes.object,
  router: PropTypes.object
};
