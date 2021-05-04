import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import update from 'lodash/fp/update';
import set from 'lodash/fp/set';

import {
  withStripes,
  IfPermission,
} from '@folio/stripes-core';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import {
  Button,
  Modal,
  ModalFooter,
  expandAllFunction,
} from '@folio/stripes/components';

import DetailsView from '../../details-view';
import QuerySearchList from '../../query-search-list';
import TitleListItem from '../../title-list-item';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import TagsAccordion from '../../tags';
import {
  AgreementsAccordion,
  UsageConsolidationAccordion,
} from '../../../features';
import QueryNotFound from '../../query-list/not-found';
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';
import HoldingStatus from './components/holding-status';
import PackageInformation from './components/package-information';
import PackageSettings from './components/package-settings';
import CoverageSettings from './components/coverage-settings';

import {
  entityAuthorityTypes,
  entityTypes,
  listTypes,
  DOMAIN_NAME,
  paths,
  accessTypesReduxStateShape,
  costPerUse as costPerUseShape,
  TITLES_PACKAGES_CREATE_DELETE_PERMISSION,
  PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION,
  RECORDS_EDIT_PERMISSION,
} from '../../../constants';
import {
  processErrors,
} from '../../utilities';

const ITEM_HEIGHT = 62;
const MAX_EXPORT_TITLE_LIMIT = 200000;

class PackageShow extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    addPackageToHoldings: PropTypes.func.isRequired,
    costPerUse: costPerUseShape.CostPerUseReduxStateShape.isRequired,
    fetchCostPerUsePackageTitles: PropTypes.func.isRequired,
    fetchPackageCostPerUse: PropTypes.func.isRequired,
    fetchPackageTitles: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    isDestroyed: PropTypes.bool,
    isFreshlySaved: PropTypes.bool,
    isNewRecord: PropTypes.bool,
    loadMoreCostPerUsePackageTitles: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    packageTitles: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    searchModal: PropTypes.node,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    tagsModel: PropTypes.object,
    toggleSelected: PropTypes.func.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showSelectionConfirmationModal: false,
      showDeselectionModal: false,
      packageSelected: this.props.model.isSelected,
      packageAllowedToAddTitles: this.props.model.allowKbToAddTitles,
      isCoverageEditable: false,
      sections: {
        packageShowTags: true,
        packageShowHoldingStatus: true,
        packageShowInformation: true,
        packageShowSettings: true,
        packageShowCoverageSettings: true,
        packageShowAgreements: true,
        packageShowTitles: true,
        packageShowNotes: true,
        packageShowUsageConsolidation: false,
      },
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { model: { allowKbToAddTitles, isSaving, isSelected } } = nextProps;
    if (!isSaving) {
      return {
        packageSelected: isSelected,
        packageAllowedToAddTitles: allowKbToAddTitles
      };
    }
    return null;
  }

  handleSelectionToggle = () => {
    this.setState({ packageSelected: !this.props.model.isSelected });
    if (this.props.model.isSelected) {
      this.setState({ showDeselectionModal: true });
    } else {
      this.setState({ packageAllowedToAddTitles: true });
      this.props.toggleSelected();
    }
  };

  commitSelectionToggle = () => {
    this.setState({ showDeselectionModal: false });
    this.props.toggleSelected();
  };

  cancelSelectionToggle = () => {
    this.setState({
      showDeselectionModal: false,
      packageSelected: this.props.model.isSelected
    });
  };

  handleCoverageEdit = (isCoverageEditable) => {
    this.setState({ isCoverageEditable });
  };

  handleSectionToggle = ({ id }) => {
    const next = update(`sections.${id}`, value => !value, this.state);
    this.setState(next);
  }

  handleExpandAll = (sections) => {
    const next = set('sections', sections, this.state);
    this.setState(next);
  }

  hasEditPermission = () => {
    const { stripes } = this.props;
    const { packageSelected } = this.state;

    const hasEditPerm = stripes.hasPerm(RECORDS_EDIT_PERMISSION);

    return !!(hasEditPerm && packageSelected);
  };

  getActionMenu = () => {
    const {
      stripes,
      model: { isCustom },
      onEdit,
      model
    } = this.props;

    const { packageSelected } = this.state;

    const requiredRemovingPermission = isCustom
      ? TITLES_PACKAGES_CREATE_DELETE_PERMISSION
      : PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION;

    const hasRequiredRemovingPermission = stripes.hasPerm(requiredRemovingPermission);
    const hasSelectionPermission = stripes.hasPerm(PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION);
    const isAddButtonNeeded = (!packageSelected || model.isPartiallySelected) && hasSelectionPermission;
    const isRemoveButtonNeeded = packageSelected && hasRequiredRemovingPermission;
    const canEdit = this.hasEditPermission();
    const isMenuNeeded = canEdit || isAddButtonNeeded || isRemoveButtonNeeded;

    if (!isMenuNeeded) return null;

    return ({ onToggle }) => (
      <>
        {canEdit &&
          <Button
            buttonStyle="dropdownItem fullWidth"
            onClick={onEdit}
            data-test-eholdings-package-edit-link
          >
            <FormattedMessage id="ui-eholdings.actionMenu.edit" />
          </Button>}
        {isRemoveButtonNeeded && this.renderRemoveFromHoldingsButton(onToggle)}
        {isAddButtonNeeded && this.renderAddToHoldingsButton(onToggle)}
      </>
    );
  };

  getBodyContent() {
    const {
      model,
      tagsModel,
      updateFolioTags,
      stripes,
      fetchPackageCostPerUse,
      fetchCostPerUsePackageTitles,
      loadMoreCostPerUsePackageTitles,
      costPerUse,
      proxyTypes,
      provider,
      accessStatusTypes,
    } = this.props;

    const {
      sections,
      packageSelected,
      packageAllowedToAddTitles,
    } = this.state;

    return (
      <>
        <HoldingStatus
          isOpen={sections.packageShowHoldingStatus}
          onToggle={this.handleSectionToggle}
          onAddToHoldings={this.toggleSelectionConfirmationModal}
          model={model}
        />

        <PackageInformation
          isOpen={sections.packageShowInformation}
          onToggle={this.handleSectionToggle}
          model={model}
        />

        <TagsAccordion
          id="packageShowTags"
          model={model}
          onToggle={this.handleSectionToggle}
          open={sections.packageShowTags}
          tagsModel={tagsModel}
          updateFolioTags={updateFolioTags}
        />

        <PackageSettings
          isOpen={sections.packageShowSettings}
          onToggle={this.handleSectionToggle}
          model={model}
          proxyTypes={proxyTypes}
          provider={provider}
          accessStatusTypes={accessStatusTypes}
          packageAllowedToAddTitles={packageAllowedToAddTitles}
          packageSelected={packageSelected}
        />

        <CoverageSettings
          isOpen={sections.packageShowCoverageSettings}
          onToggle={this.handleSectionToggle}
          packageSelected={packageSelected}
          customCoverage={model.customCoverage}
        />

        <AgreementsAccordion
          id="packageShowAgreements"
          stripes={stripes}
          refId={model.id}
          refType={entityAuthorityTypes.PACKAGE}
          isOpen={sections.packageShowAgreements}
          onToggle={this.handleSectionToggle}
          refName={model.name}
        />

        <NotesSmartAccordion
          id="packageShowNotes"
          open={sections.packageShowNotes}
          onToggle={this.handleSectionToggle}
          domainName={DOMAIN_NAME}
          entityName={model.name}
          entityType={entityTypes.PACKAGE}
          entityId={model.id}
          pathToNoteCreate={paths.NOTE_CREATE}
          pathToNoteDetails={paths.NOTES}
        />

        {packageSelected && (
          <UsageConsolidationAccordion
            id="packageShowUsageConsolidation"
            isOpen={sections.packageShowUsageConsolidation}
            onToggle={this.handleSectionToggle}
            onFilterSubmit={fetchPackageCostPerUse}
            onViewTitles={fetchCostPerUsePackageTitles}
            onLoadMoreTitles={loadMoreCostPerUsePackageTitles}
            recordType={entityTypes.PACKAGE}
            recordId={model.id}
            recordName={model.name}
            costPerUseData={costPerUse}
            isExportDisabled={model.selectedCount >= MAX_EXPORT_TITLE_LIMIT}
          />
        )}
      </>
    );
  }

  renderTitlesListItem = (item) => {
    return (
      <TitleListItem
        item={item.attributes}
        link={item.attributes && `/eholdings/resources/${item.id}`}
        showSelected
        headingLevel='h4'
      />
    );
  }

  renderTitlesList = (scrollable) => {
    const {
      packageTitles,
      fetchPackageTitles,
    } = this.props;

    return (
      <QuerySearchList
        type="package-titles"
        fetch={fetchPackageTitles}
        collection={packageTitles}
        scrollable={scrollable}
        itemHeight={ITEM_HEIGHT}
        notFoundMessage={
          <QueryNotFound type="package-titles">
            <FormattedMessage id="ui-eholdings.notFound" />
          </QueryNotFound>
        }
        renderItem={this.renderTitlesListItem}
      />
    );
  }

  renderRemoveFromHoldingsButton(onToggle) {
    const {
      model: { isCustom },
    } = this.props;

    const translationId = isCustom
      ? 'ui-eholdings.package.deletePackage'
      : 'ui-eholdings.package.removeFromHoldings';

    return (
      <Button
        data-test-eholdings-package-remove-from-holdings-action
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          this.handleSelectionToggle();
        }}
      >
        <FormattedMessage id={translationId} />
      </Button>
    );
  }

  renderAddToHoldingsButton(onToggle) {
    const {
      model: { isPartiallySelected },
    } = this.props;

    const translationIdEnding = isPartiallySelected
      ? 'addAllToHoldings'
      : 'addPackageToHoldings';

    return (
      <IfPermission perm={PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION}>
        <Button
          data-test-eholdings-package-add-to-holdings-action
          buttonStyle="dropdownItem fullWidth"
          onClick={() => {
            onToggle();
            this.toggleSelectionConfirmationModal();
          }}
        >
          <FormattedMessage id={`ui-eholdings.${translationIdEnding}`} />
        </Button>
      </IfPermission>
    );
  }

  toggleSelectionConfirmationModal = () => {
    this.setState(({ showSelectionConfirmationModal }) => ({
      showSelectionConfirmationModal: !showSelectionConfirmationModal,
    }));
  }

  renderSelectionConfirmationModal() {
    const {
      addPackageToHoldings,
      intl,
    } = this.props;

    const footer = (
      <ModalFooter>
        <Button
          data-test-confirm-package-selection
          buttonStyle="primary"
          onClick={() => {
            addPackageToHoldings();
            this.toggleSelectionConfirmationModal();
          }}
        >
          <FormattedMessage id="ui-eholdings.selectPackage.confirmationModal.confirmationButtonText" />
        </Button>
        <Button
          data-test-cancel-package-selection
          onClick={this.toggleSelectionConfirmationModal}
        >
          <FormattedMessage id="ui-eholdings.cancel" />
        </Button>
      </ModalFooter>
    );

    return (
      <Modal
        open
        label={<FormattedMessage id="ui-eholdings.selectPackage.confirmationModal.label" />}
        aria-label={intl.formatMessage({ id: 'ui-eholdings.selectPackage.confirmationModal.label' })}
        footer={footer}
        size="small"
        id="package-selection-confirmation-modal"
      >
        <SafeHTMLMessage id="ui-eholdings.selectPackage.confirmationModal.message" />
      </Modal>
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
      model,
      searchModal,
      isFreshlySaved,
      isNewRecord,
      isDestroyed,
      intl,
      packageTitles,
    } = this.props;

    const {
      showDeselectionModal,
      isCoverageEditable,
      sections,
      showSelectionConfirmationModal,
    } = this.state;

    const modalMessage = model.isCustom ?
      {
        header: <FormattedMessage id="ui-eholdings.package.modal.header.isCustom" />,
        label: intl.formatMessage({ id: 'ui-eholdings.package.modal.header.isCustom' }),
        body: <FormattedMessage id="ui-eholdings.package.modal.body.isCustom" />,
        buttonConfirm: <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm.isCustom" />,
        buttonCancel: <FormattedMessage id="ui-eholdings.package.modal.buttonCancel.isCustom" />
      } :
      {
        header: <FormattedMessage id="ui-eholdings.package.modal.header" />,
        label: intl.formatMessage({ id: 'ui-eholdings.package.modal.header' }),
        body: <FormattedMessage id="ui-eholdings.package.modal.body" />,
        buttonConfirm: <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm" />,
        buttonCancel: <FormattedMessage id="ui-eholdings.package.modal.buttonCancel" />
      };

    const toasts = [
      ...processErrors(model),
    ];

    // if coming from creating a new custom package, show a success toast
    if (isNewRecord) {
      toasts.push({
        id: `success-package-creation-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.package.toast.isNewRecord" />,
        type: 'success'
      });
    }

    // if coming from destroying a custom or managed title
    // from within custom-package, show a success toast
    if (isDestroyed) {
      toasts.push({
        id: `success-resource-destruction-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.package.toast.isDestroyed" />,
        type: 'success'
      });
    }

    // if coming from saving edits to the package, show a success toast
    if (isFreshlySaved) {
      toasts.push({
        id: `success-package-saved-${model.id}`,
        message: <FormattedMessage id="ui-eholdings.package.toast.isFreshlySaved" />,
        type: 'success'
      });
    }

    return (
      <KeyShortcutsWrapper
        toggleAllSections={this.toggleAllSections}
        onEdit={this.props.onEdit}
        isPermission={this.hasEditPermission()}
      >
        <Toaster
          toasts={toasts}
          position="bottom"
        />
        <DetailsView
          type="package"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenu={this.getActionMenu()}
          sections={sections}
          handleExpandAll={this.handleExpandAll}
          searchModal={searchModal}
          bodyContent={this.getBodyContent()}
          listType={listTypes.TITLES}
          listSectionId="packageShowTitles"
          onListToggle={this.handleSectionToggle}
          resultsLength={packageTitles.totalResults}
          renderList={this.renderTitlesList}
          ariaRole="tablist"
          bodyAriaRole="tab"
        />
        <Modal
          open={showDeselectionModal}
          size="small"
          label={modalMessage.header}
          aria-label={modalMessage.label}
          id="eholdings-package-confirmation-modal"
          footer={(
            <ModalFooter>
              <Button
                data-test-eholdings-package-deselection-confirmation-modal-yes
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
              >
                {modalMessage.buttonConfirm}
              </Button>
              <Button
                data-test-eholdings-package-deselection-confirmation-modal-no
                onClick={this.cancelSelectionToggle}
              >
                {modalMessage.buttonCancel}
              </Button>
            </ModalFooter>
          )}
        >
          {modalMessage.body}
        </Modal>
        {showSelectionConfirmationModal && this.renderSelectionConfirmationModal()}
        <NavigationModal when={isCoverageEditable} />
      </KeyShortcutsWrapper>
    );
  }
}

export default withStripes(injectIntl(PackageShow));
