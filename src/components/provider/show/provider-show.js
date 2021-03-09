import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import update from 'lodash/fp/update';
import set from 'lodash/fp/set';

import {
  withStripes,
} from '@folio/stripes-core';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import {
  Button,
  expandAllFunction,
} from '@folio/stripes/components';

import DetailsView from '../../details-view';
import QueryList from '../../query-list';
import SearchPackageListItem from '../../search-package-list-item';
import Toaster from '../../toaster';
import TagsAccordion from '../../tags';
import QueryNotFound from '../../query-list/not-found';
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';
import ProviderInformation from './components/provider-information';
import ProviderSettings from './components/provider-settings';

import { processErrors } from '../../utilities';
import {
  entityTypes,
  DOMAIN_NAME,
  paths,
  RECORDS_EDIT_PERMISSION,
} from '../../../constants';

const ITEM_HEIGHT = 62;

class ProviderShow extends Component {
  static propTypes = {
    fetchPackages: PropTypes.func.isRequired,
    isFreshlySaved: PropTypes.bool,
    listType: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    packages: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired,
    searchModal: PropTypes.node,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    tagsModel: PropTypes.object,
    updateFolioTags: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        providerShowTags: true,
        providerShowProviderInformation: true,
        providerShowProviderSettings: true,
        providerShowProviderList: true,
        providerShowNotes: true,
      }
    };
  }

  hasEditPermission = () => {
    const { stripes } = this.props;

    return stripes.hasPerm(RECORDS_EDIT_PERMISSION);
  };

  handleSectionToggle = ({ id }) => {
    const next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    const next = set('sections', sections, this.state);
    this.setState(next);
  }

  get toasts() {
    const { model, isFreshlySaved } = this.props;
    const toasts = processErrors(model);

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

  renderLastMenu() {
    const { onEdit } = this.props;

    if (!this.hasEditPermission()) return null;

    return (
      <Button
        data-test-eholdings-provider-edit-link
        buttonStyle="primary"
        onClick={onEdit}
        marginBottom0
      >
        <FormattedMessage id="ui-eholdings.actionMenu.edit" />
      </Button>
    );
  }

  getBodyContent() {
    const {
      model,
      tagsModel,
      updateFolioTags,
      proxyTypes,
      rootProxy,
    } = this.props;

    const {
      sections,
    } = this.state;

    return (
      <>
        <ProviderInformation
          isOpen={sections.providerShowProviderInformation}
          onToggle={this.handleSectionToggle}
          packagesSelected={model.packagesSelected}
          packagesTotal={model.packagesTotal}
        />

        <TagsAccordion
          id="providerShowTags"
          model={model}
          onToggle={this.handleSectionToggle}
          open={sections.providerShowTags}
          tagsModel={tagsModel}
          updateFolioTags={updateFolioTags}
        />

        <ProviderSettings
          isOpen={sections.providerShowProviderSettings}
          onToggle={this.handleSectionToggle}
          model={model}
          proxyTypes={proxyTypes}
          rootProxy={rootProxy}
        />

        <NotesSmartAccordion
          id="providerShowNotes"
          open={sections.providerShowNotes}
          onToggle={this.handleSectionToggle}
          domainName={DOMAIN_NAME}
          entityName={model.name}
          entityType={entityTypes.PROVIDER}
          entityId={model.id}
          pathToNoteCreate={paths.NOTE_CREATE}
          pathToNoteDetails={paths.NOTES}
        />
      </>
    );
  }

  renderPackagesListItem = (item) => {
    const itemLink = item.content && `/eholdings/packages/${item.content.id}`;

    return (
      <SearchPackageListItem
        link={itemLink}
        item={item.content}
        showTitleCount
        showSelectedCount
        showTags
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
        notFoundMessage={
          <QueryNotFound type="provider-packages">
            <FormattedMessage id="ui-eholdings.notFound" />
          </QueryNotFound>
        }
        renderItem={this.renderPackagesListItem}
      />
    );
  }

  toggleAllSections = (expand) => {
    this.setState((curState) => {
      const sections = expandAllFunction(curState.sections, expand);
      return { sections };
    });
  };

  render() {
    const {
      listType,
      model,
      packages,
      searchModal,
    } = this.props;

    const { sections } = this.state;

    return (
      <KeyShortcutsWrapper
        toggleAllSections={this.toggleAllSections}
        onEdit={this.props.onEdit}
        isPermission={this.hasEditPermission()}
      >
        <Toaster
          toasts={this.toasts}
          position="bottom"
        />
        <DetailsView
          type="provider"
          model={model}
          key={model.id}
          paneTitle={model.name}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          bodyContent={this.getBodyContent()}
          lastMenu={this.renderLastMenu()}
          searchModal={searchModal}
          listType={listType}
          listSectionId="providerShowProviderList"
          onListToggle={this.handleSectionToggle}
          resultsLength={packages.length}
          renderList={this.renderPackagesList}
          ariaRole="tablist"
          bodyAriaRole="tab"
        />
      </KeyShortcutsWrapper>
    );
  }
}

export default withStripes(ProviderShow);
