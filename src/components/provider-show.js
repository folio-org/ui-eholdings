import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@folio/stripes-components/lib/IconButton';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';

import DetailsView from './details-view';
import KeyValueLabel from './key-value-label';
import QueryList from './query-list';
import PackageListItem from './package-list-item';

export default function ProviderShow({
  model,
  fetchPackages
}, {
  router,
  queryParams,
  intl
}) {
  let historyState = router.history.location.state;

  return (
    <DetailsView
      type="provider"
      model={model}
      showPaneHeader={!queryParams.searchType}
      paneHeaderFirstMenu={historyState && historyState.eholdings && (
        <PaneMenu>
          <div data-test-eholdings-provider-details-back-button>
            <IconButton icon="left-arrow" onClick={() => router.history.goBack()} />
          </div>
        </PaneMenu>
      )}
      bodyContent={(
        <div>
          <KeyValueLabel label="Packages Selected">
            <div data-test-eholdings-provider-details-packages-selected>
              {intl.formatNumber(model.packagesSelected)}
            </div>
          </KeyValueLabel>

          <KeyValueLabel label="Total Packages">
            <div data-test-eholdings-provider-details-packages-total>
              {intl.formatNumber(model.packagesTotal)}
            </div>
          </KeyValueLabel>
        </div>
      )}
      listHeader="Packages"
      renderList={scrollable => (
        <QueryList
          type="provider-packages"
          fetch={fetchPackages}
          collection={model.packages}
          length={model.packagesTotal}
          scrollable={scrollable}
          itemHeight={70}
          renderItem={item => (
            <PackageListItem
              link={item.content && `/eholdings/packages/${item.content.id}`}
              item={item.content}
              showTitleCount
            />
          )}
        />
      )}
    />
  );
}

ProviderShow.propTypes = {
  model: PropTypes.object.isRequired,
  fetchPackages: PropTypes.func.isRequired
};

ProviderShow.contextTypes = {
  router: PropTypes.object,
  queryParams: PropTypes.object,
  intl: PropTypes.object
};
