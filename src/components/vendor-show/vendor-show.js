import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@folio/stripes-components/lib/Icon';
import IconButton from '@folio/stripes-components/lib/IconButton';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';

import KeyValueLabel from '../key-value-label';
import List from '../list';
import PackageListItem from '../package-list-item';
import styles from './vendor-show.css';

export default function VendorShow({ model }, { router, queryParams }) {
  let historyState = router.history.location.state;

  return (
    <div>
      {!queryParams.searchType && (
        <PaneHeader
          firstMenu={historyState && historyState.eholdings && (
            <PaneMenu>
              <div data-test-eholdings-vendor-details-back-button>
                <IconButton icon="left-arrow" onClick={() => router.history.goBack()} />
              </div>
            </PaneMenu>
          )}
        />
      )}
      <div className={styles['detail-container']} data-test-eholdings-vendor-details>
        {model.isLoaded ? (
          <div>
            <div className={styles['detail-container-header']}>
              <KeyValueLabel label="Vendor">
                <h1 data-test-eholdings-vendor-details-name>
                  {model.name}
                </h1>
              </KeyValueLabel>
            </div>

            <KeyValueLabel label="Packages Selected">
              <div data-test-eholdings-vendor-details-packages-selected>
                {model.packagesSelected}
              </div>
            </KeyValueLabel>

            <KeyValueLabel label="Total Packages">
              <div data-test-eholdings-vendor-details-packages-total>
                {model.packagesTotal}
              </div>
            </KeyValueLabel>

            <hr />

            <h3>Packages</h3>
            <List>
              {model.packages.isLoading ? (
                <Icon icon="spinner-ellipsis" />
              ) : (
                model.packages.map(pkg => (
                  <li key={pkg.id} data-test-eholdings-package-list-item>
                    <PackageListItem
                      link={`/eholdings/packages/${pkg.id}`}
                      showTitleCount
                      item={pkg}
                    />
                  </li>
                ))
              )}
            </List>
          </div>
        ) : model.request.isRejected ? (
          <p data-test-eholdings-vendor-details-error>
            {model.request.errors[0].title}
          </p>
        ) : model.isLoading ? (
          <Icon icon="spinner-ellipsis" />
        ) : null}
      </div>
    </div>
  );
}

VendorShow.propTypes = {
  model: PropTypes.object.isRequired
};

VendorShow.contextTypes = {
  router: PropTypes.object,
  queryParams: PropTypes.object
};
