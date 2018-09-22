import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import update from 'lodash/fp/update';
import set from 'lodash/fp/set';
import { Accordion, Icon, IconButton, KeyValue } from '@folio/stripes-components';
import { intlShape, injectIntl, FormattedNumber, FormattedMessage } from 'react-intl';
import capitalize from 'lodash/capitalize';

import { processErrors } from '../../utilities';
import DetailsView from '../../details-view';
import QueryList from '../../query-list';
import PackageListItem from '../../package-list-item';
import Toaster from '../../toaster';
import ProxyDisplay from '../../proxy-display';
import TokenDisplay from '../../token-display';
import styles from './provider-show.css';

class ProviderShow extends Component {
   static propTypes = {
     proxyTypes: PropTypes.object.isRequired,
     rootProxy: PropTypes.object.isRequired,
     model: PropTypes.object.isRequired,
     packages: PropTypes.object.isRequired,
     fetchPackages: PropTypes.func.isRequired,
     searchModal: PropTypes.node,
     intl: intlShape.isRequired,
     listType: PropTypes.string.isRequired,
     history: PropTypes.object.isRequired,
     location: PropTypes.object.isRequired
   };

  state = {
    sections: {
      providerShowProviderInformation: true,
      providerShowProviderSettings: true,
      providerShowProviderList: true,
    }
  };

  handleSectionToggle = ({ id }) => {
    let next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    let next = set('sections', sections, this.state);
    this.setState(next);
  }

  get toasts() {
    let { model, intl, history } = this.props;
    let toasts = processErrors(model);

    // if coming from saving edits to the package, show a success toast
    if (history.action === 'PUSH' &&
        history.location.state &&
        history.location.state.isFreshlySaved) {
      toasts.push({
        id: `success-provider-saved-${model.id}`,
        message: intl.formatMessage({ id: 'ui-eholdings.provider.toast.isFreshlySaved' }),
        type: 'success'
      });
    }

    return toasts;
  }

  render() {
    let {
      fetchPackages,
      listType,
      model,
      packages,
      searchModal,
      proxyTypes,
      rootProxy,
      location
    } = this.props;
    let { sections } = this.state;
    let hasProxy = model.proxy && model.proxy.id;
    let hasToken = model.providerToken && model.providerToken.prompt;
    let hasProviderSettings = hasProxy || hasToken;

    let actionMenuItems = [
      {
        label: <FormattedMessage id="ui-eholdings.actionMenu.edit" />,
        to: {
          pathname: `/eholdings/providers/${model.id}/edit`,
          search: location.search,
          state: { eholdings: true }
        }
      }
    ];

    if (location.search) {
      actionMenuItems.push({
        label: <FormattedMessage id="ui-eholdings.actionMenu.fullView" />,
        to: {
          pathname: `/eholdings/providers/${model.id}`,
          state: { eholdings: true }
        },
        className: styles['full-view-link']
      });
    }

    return (
      <div>
        <Toaster toasts={this.toasts} position="bottom" />

        <DetailsView
          type="provider"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenuItems={actionMenuItems}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          lastMenu={(
            <IconButton
              data-test-eholdings-provider-edit-link
              icon="edit"
              ariaLabel={`Edit ${model.name}`}
              to={{
                pathname: `/eholdings/providers/${model.id}/edit`,
                search: location.search,
                state: { eholdings: true }
              }}
            />
          )}
          bodyContent={(
            <div>
              <Accordion
                label={<FormattedMessage id="ui-eholdings.provider.providerInformation" />}
                open={sections.providerShowProviderInformation}
                id="providerShowProviderInformation"
                onToggle={this.handleSectionToggle}
              >
                <KeyValue label={<FormattedMessage id="ui-eholdings.provider.packagesSelected" />}>
                  <div data-test-eholdings-provider-details-packages-selected>
                    <FormattedNumber value={model.packagesSelected} />
                  </div>
                </KeyValue>

                <KeyValue label={<FormattedMessage id="ui-eholdings.provider.totalPackages" />}>
                  <div data-test-eholdings-provider-details-packages-total>
                    <FormattedNumber value={model.packagesTotal} />
                  </div>
                </KeyValue>
              </Accordion>
              {hasProviderSettings && (
                <Accordion
                  label={<FormattedMessage id="ui-eholdings.provider.providerSettings" />}
                  open={sections.providerShowProviderSettings}
                  id="providerShowProviderSettings"
                  onToggle={this.handleSectionToggle}
                >
                  {hasProxy && (
                    (!proxyTypes.request.isResolved || !rootProxy.request.isResolved || model.isLoading) ? (
                      <Icon icon="spinner-ellipsis" />
                    ) : (
                      <ProxyDisplay
                        model={model}
                        proxyTypes={proxyTypes}
                        inheritedProxyId={rootProxy.data.attributes.proxyTypeId}
                      />
                    ))}

                  {hasToken && (
                    (model.isLoading) ? (
                      <Icon icon="spinner-ellipsis" />
                    ) : (
                      <KeyValue label={<FormattedMessage id="ui-eholdings.provider.token" />}>
                        <TokenDisplay
                          token={model.providerToken}
                          type="provider"
                        />
                      </KeyValue>
                    ))}
                </Accordion>
              )}
            </div>
          )}
          searchModal={searchModal}
          listType={capitalize(listType)}
          listSectionId="providerShowProviderList"
          onListToggle={this.handleSectionToggle}
          resultsLength={packages.length}
          renderList={scrollable => (
            <QueryList
              type="provider-packages"
              fetch={fetchPackages}
              collection={packages}
              length={packages.length}
              scrollable={scrollable}
              itemHeight={70}
              notFoundMessage={<FormattedMessage id="ui-eholdings.notFound" />}
              renderItem={item => (
                <PackageListItem
                  link={item.content && `/eholdings/packages/${item.content.id}`}
                  item={item.content}
                  showTitleCount
                  headingLevel='h4'
                />
              )}
            />
          )}
        />
      </div>
    );
  }
}

export default injectIntl(withRouter(ProviderShow));
