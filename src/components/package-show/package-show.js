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

export default function PackageShow({ model, toggleSelected }, { intl, router }) {
  let historyState = router.history.location.state;
  let queryString = router.route.location.search;

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
        {model.isLoaded ? (
          <div>
            <div className={styles['detail-container-header']}>
              <KeyValueLabel label="Package">
                <h1 data-test-eholdings-package-details-name>
                  {model.name}
                </h1>
              </KeyValueLabel>
            </div>

            <KeyValueLabel label="Vendor">
              <div data-test-eholdings-package-details-vendor>
                <Link to={`/eholdings/vendors/${model.vendorId}`}>{model.vendorName}</Link>
              </div>
            </KeyValueLabel>

            {model.contentType && (
              <KeyValueLabel label="Content Type">
                <div data-test-eholdings-package-details-content-type>
                  {model.contentType}
                </div>
              </KeyValueLabel>
            ) }

            <KeyValueLabel label="Titles Selected">
              <div data-test-eholdings-package-details-titles-selected>
                {model.selectedCount}
              </div>
            </KeyValueLabel>

            <KeyValueLabel label="Total Titles">
              <div data-test-eholdings-package-details-titles-total>
                {model.titleCount}
              </div>
            </KeyValueLabel>

            {(model.customCoverage.beginCoverage || model.customCoverage.endCoverage) && (
              <KeyValueLabel label="Custom Coverage">
                <div data-test-eholdings-package-details-custom-coverage>
                  {formatISODateWithoutTime(model.customCoverage.beginCoverage, intl)} - {formatISODateWithoutTime(model.customCoverage.endCoverage, intl)}
                </div>
              </KeyValueLabel>
            )}

            <hr />

            <label
              data-test-eholdings-package-details-selected
              htmlFor="package-details-toggle-switch"
            >
              <h4>{model.isSelected ? 'Selected' : 'Not Selected'}</h4>
              <ToggleSwitch
                onChange={toggleSelected}
                checked={model.isSelected}
                isPending={model.update.isPending}

                id="package-details-toggle-switch"
              />
            </label>

            {model.visibilityData.isHidden && (
              <div data-test-eholdings-package-details-is-hidden>
                <p><strong>This package is hidden.</strong></p>
                <p><em>{model.visibilityData.reason}</em></p>
                <hr />
              </div>
            )}

            <h3>Titles</h3>
            <List data-test-eholdings-package-details-title-list>
              {model.customerResources.isLoading ? (
                <Icon icon="spinner-ellipsis" />
              ) : (
                model.customerResources.map(item => (
                  <TitleListItem
                    key={item.id}
                    item={item}
                    link={`/eholdings/customer-resources/${item.id}`}
                    showSelected
                  />
                ))
              )}
            </List>
          </div>
        ) : model.request.isRejected ? (
          <p data-test-eholdings-package-details-error>
            {model.request.errors[0].title}
          </p>
        ) : model.isLoading ? (
          <Icon icon="spinner-ellipsis" />
        ) : null}
      </div>
    </div>
  );
}

PackageShow.propTypes = {
  model: PropTypes.object.isRequired,
  toggleSelected: PropTypes.func.isRequired
};

PackageShow.contextTypes = {
  intl: PropTypes.object,
  router: PropTypes.object
};
