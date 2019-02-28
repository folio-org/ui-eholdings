import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import update from 'lodash/fp/update';
import set from 'lodash/fp/set';
import get from 'lodash/get';
import {
  Accordion,
  Button,
  Headline,
  Icon,
  IconButton,
  KeyValue,
  Badge,
} from '@folio/stripes/components';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import capitalize from 'lodash/capitalize';

import { processErrors } from '../../utilities';
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
        <Button
          buttonStyle="dropdownItem fullWidth"
          onClick={onEdit}
        >
          <FormattedMessage id="ui-eholdings.actionMenu.edit" />
        </Button>

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

  render() {
    let {
      fetchPackages,
      listType,
      model,
      packages,
      searchModal,
      proxyTypes,
      rootProxy,
      onEdit,
      tagsModel,
      updateEntityTags,
      updateFolioTags,
    } = this.props;
    let { sections } = this.state;
    let hasProxy = model.proxy && model.proxy.id;
    let hasToken = model.providerToken && model.providerToken.prompt;
    const hasProviderSettings = hasProxy || hasToken;
    const tagRecords = get(tagsModel, ['resolver', 'state', 'tags', 'records'], {});
    const tagLabelsArr = Object.values(tagRecords).map((tag) => tag.attributes);
    const hasSelectedPackages = model.packagesSelected > 0;
    const entityTags = get(model, ['tags', 'tagList'], []);

    return (
      <div>
        <Toaster toasts={this.toasts} position="bottom" />

        <DetailsView
          type="provider"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenu={this.getActionMenu}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          lastMenu={(
            <FormattedMessage
              id="ui-eholdings.label.editLink"
              values={{
                name: model.name
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
          )}
          bodyContent={(
            <div>
              {hasSelectedPackages && (
                <Accordion
                  label={<Headline size="large" tag="h3"><FormattedMessage id="ui-eholdings.provider.providerTags" /></Headline>}
                  open={sections.providerShowTags}
                  id="providerShowTags"
                  onToggle={this.handleSectionToggle}
                  displayWhenClosed={
                    <Badge sixe='small'>
                      <span data-test-eholdings-provider-tags-bage>
                        <FormattedNumber value={entityTags.length} />
                      </span>
                    </Badge>
                  }
                >
                  {(!tagsModel.request.isResolved || model.isLoading)
                    ? <Icon icon="spinner-ellipsis" />
                    : (
                      <Tags
                        updateEntityTags={updateEntityTags}
                        updateFolioTags={updateFolioTags}
                        model={model}
                        tags={tagLabelsArr}
                      />
                    )
                  }
                </Accordion>
              )}
              <Accordion
                label={<Headline size="large" tag="h3"><FormattedMessage id="ui-eholdings.provider.providerInformation" /></Headline>}
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
                  label={<Headline size="large" tag="h3"><FormattedMessage id="ui-eholdings.provider.providerSettings" /></Headline>}
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
              itemHeight={ITEM_HEIGHT}
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

export default ProviderShow;
