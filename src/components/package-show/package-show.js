import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import List from '@folio/stripes-components/lib/List';
import styles from './package-show.css';

export default function PackageShow({ vendorPackage, packageTitles }) {
  const renderTitleListItem = item => (
    <li key={item.titleId} data-test-eholdings-package-details-title>
      <h5 data-test-eholdings-package-details-title-name>
        <Link to={`/eholdings/vendors/${vendorPackage.vendorId}/packages/${vendorPackage.packageId}/titles/${item.titleId}`}>{item.titleName}</Link>
      </h5>
      <div data-test-eholdings-package-details-title-selected>
        { /* assumes that customerResourcesList.length will always equal one */  }
        <span>{item.customerResourcesList[0].isSelected ? 'Selected' : 'Unselected'}</span>
      </div>
    </li>
  );

  return (
    <div data-test-eholdings-package-details>
      <Paneset>
        <Pane defaultWidth="100%">
          {vendorPackage ? (
            <div>
              <h3 data-test-eholdings-package-details-vendor>
                <Link to={`/eholdings/vendors/${vendorPackage.vendorId}`}>{vendorPackage.vendorName}</Link>
              </h3>
              <h1 data-test-eholdings-package-details-name>
                {vendorPackage.packageName}
              </h1>
              <div data-test-eholdings-package-details-content-type>
                <KeyValue label="Content Type" value={vendorPackage.contentType} />
              </div>
              <div data-test-eholdings-package-details-selected>
                <KeyValue label="Selected" value={vendorPackage.isSelected ? 'Selected' : 'Not Selected'} />
              </div>
              <div data-test-eholdings-package-details-titles-total>
                <KeyValue label="Total Titles" value={vendorPackage.titleCount} />
              </div>
              <div data-test-eholdings-package-details-titles-selected>
                <KeyValue label="Selected Titles" value={vendorPackage.selectedCount} />
              </div>

              {packageTitles && packageTitles.length ? (
                <div>
                  <h3>Titles</h3>
                  <List
                      itemFormatter={renderTitleListItem}
                      items={packageTitles}
                      listClass={styles.list}
                      />
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
