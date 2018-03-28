import React from 'react';
import PropTypes from 'prop-types';
import { KeyValue } from '@folio/stripes-components';

import DetailsView from './details-view';
import QueryList from './query-list';
import PackageListItem from './package-list-item';
import DetailsViewSection from './details-view-section';

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
        <DetailsViewSection label="Provider information">
          <KeyValue label="Packages selected">
            <div data-test-eholdings-provider-details-packages-selected>
              {intl.formatNumber(model.packagesSelected)}
            </div>
          </KeyValue>

          <KeyValue label="Total packages">
            <div data-test-eholdings-provider-details-packages-total>
              {intl.formatNumber(model.packagesTotal)}
            </div>
          </KeyValue>
        </DetailsViewSection>
      )}
      listType="packages"
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
