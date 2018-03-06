import React from 'react';
import PropTypes from 'prop-types';

import DetailsView from './details-view';
import KeyValueLabel from './key-value-label';
import QueryList from './query-list';
import PackageListItem from './package-list-item';

export default function ProviderShow({
  model,
  fetchPackages
}, {
  intl
}) {
  return (
    <DetailsView
      type="provider"
      model={model}
      paneTitle={model.name}
      bodyContent={(
        <div>
          <KeyValueLabel label="Packages selected">
            <div data-test-eholdings-provider-details-packages-selected>
              {intl.formatNumber(model.packagesSelected)}
            </div>
          </KeyValueLabel>

          <KeyValueLabel label="Total packages">
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
