import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedNumber,
  FormattedMessage,
} from 'react-intl';

import update from 'lodash/fp/update';
import set from 'lodash/fp/set';
import hasIn from 'lodash/fp/hasIn';
import capitalize from 'lodash/capitalize';

import { IfPermission } from '@folio/stripes-core';
import {
  Accordion,
  Button,
  Headline,
  Icon,
  IconButton,
  KeyValue,
  Badge,
} from '@folio/stripes/components';

import {
  processErrors,
  getEntityTags,
  getTagLabelsArr,
} from '../../utilities';

import DetailsView from '../../details-view';
import QueryList from '../../query-list';
import PackageListItem from '../../package-list-item';
import Toaster from '../../toaster';
import ProxyDisplay from '../../proxy-display';
import TokenDisplay from '../../token-display';
import Tags from '../../tags';

const ITEM_HEIGHT = 53;

class ProviderShow extends Component {
  static propTypes = {
    fetchPackages: PropTypes.func.isRequired,
    isFreshlySaved: PropTypes.bool,
    listType: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onFullView: PropTypes.func,
    packages: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired,
    searchModal: PropTypes.node,
    tagsModel: PropTypes.object,
    updateEntityTags: PropTypes.func.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
  };

  state = {
    sections: {
      providerShowTags: true,
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
    let { model, isFreshlySaved } = this.props;
    let toasts = processErrors(model);

    // if coming from saving edits to the package, show a success toast
    if (isFreshlySaved) {
      toasts.push({
        id: `success-provider-saved-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.provider.toast.isFreshlySaved" />,
        type: 'success'
      });
    }

    return toasts;
  }

  getActionMenu = () => {
    const {
      onEdit,
      onFullView,
    } = this.props;

    return (
      <Fragment>
        <IfPermission perm="ui-eholdings.records.edit">
          <Button
            buttonStyle="dropdownItem fullWidth"
            onClick={onEdit}
          >
            <FormattedMessage id="ui-eholdings.actionMenu.edit" />
          </Button>
        </IfPermission>

        {onFullView && (
          <Button
            buttonStyle="dropdownItem fullWidth"
            onClick={onFullView}
          >
            <FormattedMessage id="ui-eholdings.actionMenu.fullView" />
          </Button>
        )}
      </Fragment>
    );
  }

  renderLastMenu() {
    let {
      model: { name },
      onEdit,
    } = this.props;

    return (
      <IfPermission perm="ui-eholdings.records.edit">
        <FormattedMessage
          id="ui-eholdings.label.editLink"
          values={{
            name,
          }}
        >
          {ariaLabel => (
            <IconButton
              data-test-eholdings-provider-edit-link
              icon="edit"
              ariaLabel={ariaLabel}
              onClick={onEdit}
            />
          )}
        </FormattedMessage>
      </IfPermission>
    );
  }

  renderTags() {
    const {
      model,
      tagsModel,
      updateEntityTags,
      updateFolioTags,
    } = this.props;

    const tagsIsLoading = !tagsModel.request.isResolved || model.isLoading;

    return tagsIsLoading
      ? <Icon icon="spinner-ellipsis" />
      : (
        <Tags
          updateEntityTags={updateEntityTags}
          updateFolioTags={updateFolioTags}
          model={model}
          tags={getTagLabelsArr(tagsModel)}
        />
      );
  }

  renderProxy() {
    const {
      proxyTypes,
      rootProxy,
      model,
    } = this.props;

    const proxyIsLoading = !proxyTypes.request.isResolved || !rootProxy.request.isResolved || model.isLoading;

    return proxyIsLoading
      ? <Icon icon="spinner-ellipsis" />
      : (
        <ProxyDisplay
          model={model}
          proxyTypes={proxyTypes}
          inheritedProxyId={rootProxy.data.attributes.proxyTypeId}
        />
      );
  }

  renderToken() {
    const {
      model,
    } = this.props;

    return model.isLoading
      ? <Icon icon="spinner-ellipsis" />
      : (
        <KeyValue label={<FormattedMessage id="ui-eholdings.provider.token" />}>
          <TokenDisplay
            token={model.providerToken}
            type="provider"
          />
        </KeyValue>
      );
  }

  getBodyContent() {
    const {
      model,
    } = this.props;

    const {
      sections,
    } = this.state;

    const hasProxy = hasIn('proxy.id', model);
    const hasToken = hasIn('providerToken.prompt', model);
    const hasProviderSettings = hasProxy || hasToken;
    const hasSelectedPackages = model.packagesSelected > 0;

    return (
      <div>
        {
          hasSelectedPackages && (
            <Accordion
              label={(
                <Headline
                  size="large"
                  tag="h3"
                >
                  <FormattedMessage id="ui-eholdings.tags" />
                </Headline>
              )}
              open={sections.providerShowTags}
              id="providerShowTags"
              onToggle={this.handleSectionToggle}
              displayWhenClosed={
                <Badge sixe='small'>
                  <span data-test-eholdings-provider-tags-bage>
                    <FormattedNumber value={getEntityTags(model).length} />
                  </span>
                </Badge>
              }
            >
              {this.renderTags()}
            </Accordion>
          )
        }
        <Accordion
          label={(
            <Headline
              size="large"
              tag="h3"
            >
              <FormattedMessage id="ui-eholdings.provider.providerInformation" />
            </Headline>
          )}
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
        {
          hasProviderSettings && (
            <Accordion
              label={(
                <Headline
                  size="large"
                  tag="h3"
                >
                  <FormattedMessage id="ui-eholdings.provider.providerSettings" />
                </Headline>
              )}
              open={sections.providerShowProviderSettings}
              id="providerShowProviderSettings"
              onToggle={this.handleSectionToggle}
            >
              {hasProxy && this.renderProxy()}
              {hasToken && this.renderToken()}
            </Accordion>
          )}
      </div>
    );
  }

  renderPackagesListItem = (item) => {
    const itemLink = item.content && `/eholdings/packages/${item.content.id}`;

    return (
      <PackageListItem
        link={itemLink}
        item={item.content}
        showTitleCount
        headingLevel='h4'
      />
    );
  }

  renderPackagesList = (scrollable) => {
    const {
      fetchPackages,
      packages,
    } = this.props;

    return (
      <QueryList
        type="provider-packages"
        fetch={fetchPackages}
        collection={packages}
        length={packages.length}
        scrollable={scrollable}
        itemHeight={ITEM_HEIGHT}
        notFoundMessage={<FormattedMessage id="ui-eholdings.notFound" />}
        renderItem={this.renderPackagesListItem}
      />
    );
  }

  render() {
    const {
      listType,
      model,
      packages,
      searchModal,
    } = this.props;

    const { sections } = this.state;

    return (
      <div>
        <Toaster
          toasts={this.toasts}
          position="bottom"
        />

        <DetailsView
          type="provider"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenu={this.getActionMenu}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          bodyContent={this.getBodyContent()}
          lastMenu={this.renderLastMenu()}
          searchModal={searchModal}
          listType={capitalize(listType)}
          listSectionId="providerShowProviderList"
          onListToggle={this.handleSectionToggle}
          resultsLength={packages.length}
          renderList={this.renderPackagesList}
        />
      </div>
    );
  }
}

export default ProviderShow;
