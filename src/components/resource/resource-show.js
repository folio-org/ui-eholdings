import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import update from 'lodash/fp/update';
import set from 'lodash/fp/set';

import {
  withStripes,
} from '@folio/stripes-core';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import {
  Button,
  Modal,
  ModalFooter,
  expandAllFunction,
} from '@folio/stripes/components';

import DetailsView from '../details-view';
import {
  AgreementsAccordion,
  CustomLabelsAccordion,
  UsageConsolidationAccordion,
} from '../../features';
import Toaster from '../toaster';
import TagsAccordion from '../tags';
import { CustomLabelsShowSection } from '../custom-labels-section';
import KeyShortcutsWrapper from '../key-shortcuts-wrapper';
import HoldingStatus from './components/holding-status';
import ResourceInformation from './components/resource-information';
import ResourceSettings from './components/resource-settings';
import CoverageSettings from './components/coverage-settings';
import {
  entityAuthorityTypes,
  entityTypes,
  paths,
  DOMAIN_NAME,
  accessTypesReduxStateShape,
  costPerUse as costPerUseShape,
  TITLES_PACKAGES_CREATE_DELETE_PERMISSION,
  PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION,
  RECORDS_EDIT_PERMISSION,
} from '../../constants';
import {
  processErrors,
  getUserDefinedFields,
} from '../utilities';

class ResourceShow extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    costPerUse: costPerUseShape.CostPerUseReduxStateShape.isRequired,
    fetchResourceCostPerUse: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    isFreshlySaved: PropTypes.bool,
    model: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }),
    tagsModel: PropTypes.object,
    toggleSelected: PropTypes.func.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showSelectionModal: false,
      resourceSelected: this.props.model.isSelected,
      sections: {
        resourceShowTags: true,
        resourceShowHoldingStatus: true,
        resourceShowInformation: true,
        resourceShowCustomLabels: true,
        resourceShowSettings: true,
        resourceShowCoverageSettings: true,
        resourceShowAgreements: true,
        resourceShowNotes: true,
        resourceShowUsageConsolidation: false,
      },
    };
  }

  static getDerivedStateFromProps({ model }, prevState) {
    return !model.isSaving ?
      { resourceSelected: model.isSelected } :
      prevState;
  }

  hasEditPermission = () => {
    const { stripes } = this.props;
    const { resourceSelected } = this.state;

    const hasEditPermission = stripes.hasPerm(RECORDS_EDIT_PERMISSION);
    const hasCreateAndDeletePermission = stripes.hasPerm(TITLES_PACKAGES_CREATE_DELETE_PERMISSION);

    return ((hasEditPermission || hasCreateAndDeletePermission) && resourceSelected);
  };

  handleHoldingStatus = () => {
    if (this.props.model.isSelected) {
      this.setState({ showSelectionModal: true });
    } else {
      this.props.toggleSelected();
    }
  };

  commitSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      resourceSelected: false
    });
    this.props.toggleSelected();
  };

  cancelSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      resourceSelected: this.props.model.isSelected
    });
  };

  handleSectionToggle = ({ id }) => {
    const next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    const next = set('sections', sections, this.state);
    this.setState(next);
  }

  toggleAllSections = (expand) => {
    this.setState((curState) => {
      const sections = expandAllFunction(curState.sections, expand);
      return { sections };
    });
  };

  getActionMenu = () => {
    const {
      onEdit,
      stripes,
    } = this.props;
    const hasCreateAndDeletePermission = stripes.hasPerm(TITLES_PACKAGES_CREATE_DELETE_PERMISSION);
    const hasSelectionPermission = stripes.hasPerm(PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION);
    const canEdit = this.hasEditPermission();
    const canSelectAndUnselect = hasSelectionPermission || hasCreateAndDeletePermission;
    const isMenuNeeded = canEdit || hasSelectionPermission;

    if (!isMenuNeeded) return null;

    return ({ onToggle }) => (
      <>
        {canEdit &&
          <Button
            buttonStyle="dropdownItem fullWidth"
            data-test-eholdings-resource-edit-link
            onClick={onEdit}
          >
            <FormattedMessage id="ui-eholdings.actionMenu.edit" />
          </Button>}
        {canSelectAndUnselect && this.renderSelectionButton(onToggle)}
      </>
    );
  }

  renderSelectionButton(onToggle) {
    const { resourceSelected } = this.state;

    return (
      resourceSelected
        ? (
          <Button
            data-test-eholdings-remove-resource-from-holdings
            buttonStyle="dropdownItem fullWidth"
            onClick={() => {
              onToggle();
              this.handleHoldingStatus();
            }}
          >
            <FormattedMessage id="ui-eholdings.resource.actionMenu.removeHolding" />
          </Button>
        )
        : (
          <Button
            data-test-eholdings-add-resource-to-holdings
            buttonStyle="dropdownItem fullWidth"
            onClick={() => {
              onToggle();
              this.handleHoldingStatus();
            }}
          >
            <FormattedMessage id="ui-eholdings.resource.actionMenu.addHolding" />
          </Button>
        )
    );
  }

  render() {
    const {
      model,
      isFreshlySaved,
      tagsModel,
      updateFolioTags,
      stripes,
      fetchResourceCostPerUse,
      costPerUse,
      intl,
      accessStatusTypes,
      proxyTypes,
    } = this.props;

    const {
      showSelectionModal,
      resourceSelected,
      sections
    } = this.state;

    const userDefinedFields = getUserDefinedFields(model);
    const showCustomLables = model.isTitleCustom || model.isSelected;

    const toasts = processErrors(model);
    const showUsageConsolidation = model.isSelected || (!model.isSelected && model.titleHasSelectedResources);

    // if coming from updating any value on managed title in a managed package
    // show a success toast
    if (isFreshlySaved) {
      toasts.push({
        id: `success-package-creation-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.resource.toast.isFreshlySaved" />,
        type: 'success'
      });
    }

    return (
      <KeyShortcutsWrapper
        toggleAllSections={this.toggleAllSections}
        onEdit={this.props.onEdit}
        isPermission={this.hasEditPermission()}
      >
        <Toaster toasts={toasts} position="bottom" />

        <DetailsView
          type="resource"
          model={model}
          paneTitle={model.title.name}
          paneSub={model.package.name}
          actionMenu={this.getActionMenu()}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          ariaRole="tablist"
          bodyAriaRole="tab"
          bodyContent={(
            <>
              <HoldingStatus
                isOpen={sections.resourceShowHoldingStatus}
                onToggle={this.handleSectionToggle}
                onAddToHoldings={this.handleHoldingStatus}
                model={model}
              />

              <ResourceInformation
                isOpen={sections.resourceShowInformation}
                onToggle={this.handleSectionToggle}
                model={model}
              />

              <TagsAccordion
                id="resourceShowTags"
                model={model}
                onToggle={this.handleSectionToggle}
                open={sections.resourceShowTags}
                tagsModel={tagsModel}
                updateFolioTags={updateFolioTags}
              />

              <ResourceSettings
                isOpen={sections.resourceShowSettings}
                onToggle={this.handleSectionToggle}
                model={model}
                resourceSelected={resourceSelected}
                accessStatusTypes={accessStatusTypes}
                proxyTypes={proxyTypes}
              />

              <CoverageSettings
                isOpen={sections.resourceShowCoverageSettings}
                onToggle={this.handleSectionToggle}
                model={model}
                resourceSelected={resourceSelected}
              />

              {showCustomLables &&
                <CustomLabelsAccordion
                  id="resourceShowCustomLabels"
                  isOpen={sections.resourceShowCustomLabels}
                  onToggle={this.handleSectionToggle}
                  section={CustomLabelsShowSection}
                  userDefinedFields={userDefinedFields}
                />}

              <AgreementsAccordion
                id="resourceShowAgreements"
                stripes={stripes}
                refId={model.id}
                refType={entityAuthorityTypes.RESOURCE}
                isOpen={sections.resourceShowAgreements}
                onToggle={this.handleSectionToggle}
                refName={model.title.name}
              />

              <NotesSmartAccordion
                id="resourceShowNotes"
                open={sections.resourceShowNotes}
                onToggle={this.handleSectionToggle}
                domainName={DOMAIN_NAME}
                entityName={model.name}
                entityType={entityTypes.RESOURCE}
                entityId={model.id}
                pathToNoteCreate={paths.NOTE_CREATE}
                pathToNoteDetails={paths.NOTES}
              />

              {showUsageConsolidation && (
                <UsageConsolidationAccordion
                  id="resourceShowUsageConsolidation"
                  isOpen={sections.resourceShowUsageConsolidation}
                  onToggle={this.handleSectionToggle}
                  onFilterSubmit={fetchResourceCostPerUse}
                  recordType={entityTypes.RESOURCE}
                  costPerUseData={costPerUse}
                />
              )}
            </>
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label={<FormattedMessage id="ui-eholdings.resource.show.modal.header" />}
          id="eholdings-resource-deselection-confirmation-modal"
          aria-label={intl.formatMessage({ id: 'ui-eholdings.resource.show.modal.header' })}
          footer={(
            <ModalFooter>
              <Button
                data-test-eholdings-resource-deselection-confirmation-modal-yes
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
              >
                <FormattedMessage id="ui-eholdings.resource.modal.buttonConfirm" />
              </Button>
              <Button
                data-test-eholdings-resource-deselection-confirmation-modal-no
                onClick={this.cancelSelectionToggle}
              >
                <FormattedMessage id="ui-eholdings.resource.modal.buttonCancel" />
              </Button>
            </ModalFooter>
          )}
        >
          {
            /*
               we use <= here to account for the case where a user
               selects and then immediately deselects the
               resource
            */
            model.package.titleCount <= 1 && model.title.isTitleCustom
              ? (
                <span data-test-eholdings-deselect-final-title-warning>
                  <FormattedMessage id="ui-eholdings.resource.modal.body.isCustom.lastTitle" />
                </span>
              )
              : (
                <span data-test-eholdings-deselect-title-warning>
                  <FormattedMessage id="ui-eholdings.resource.show.modal.body" />
                </span>
              )
          }
        </Modal>
      </KeyShortcutsWrapper>
    );
  }
}

export default withStripes(injectIntl(ResourceShow));
