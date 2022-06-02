import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import omit from 'lodash/omit';

import {
  useStripes,
  IfPermission,
} from '@folio/stripes/core';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
} from '@folio/stripes/components';

import DetailsView from '../../details-view';
import QuerySearchList from '../../query-search-list';
import TitleListItem from '../../title-list-item';
import Toaster from '../../toaster';
import TagsAccordion from '../../tags';
import {
  AgreementsAccordion,
  UsageConsolidationAccordion,
  ExportPackageResourcesModal,
} from '../../../features';
import QueryNotFound from '../../query-search-list/not-found';
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';
import HoldingStatus from './components/holding-status';
import PackageInformation from './components/package-information';
import PackageSettings from './components/package-settings';
import CoverageSettings from './components/coverage-settings';
import SelectionModal from '../../selection-modal';
import { useSectionToggle } from '../../../hooks';

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
  transformQueryParams,
  qs,
} from '../../utilities';

import styles from './package-show.css';

const ITEM_HEIGHT = 62;
const MAX_EXPORT_TITLE_LIMIT = 200000;

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
  addPackageToHoldings: PropTypes.func.isRequired,
  costPerUse: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  fetchCostPerUsePackageTitles: PropTypes.func.isRequired,
  fetchPackageCostPerUse: PropTypes.func.isRequired,
  fetchPackageTitles: PropTypes.func.isRequired,
  isDestroyed: PropTypes.bool,
  isFreshlySaved: PropTypes.bool,
  isNewRecord: PropTypes.bool,
  isTitlesUpdating: PropTypes.bool,
  loadMoreCostPerUsePackageTitles: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  packageTitles: PropTypes.object.isRequired,
  pkgSearchParams: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired,
  searchModal: PropTypes.node,
  tagsModel: PropTypes.object,
  toggleSelected: PropTypes.func.isRequired,
  updateFolioTags: PropTypes.func.isRequired,
};

const PackageShow = ({
  accessStatusTypes,
  addPackageToHoldings,
  costPerUse,
  fetchCostPerUsePackageTitles,
  fetchPackageCostPerUse,
  fetchPackageTitles,
  isDestroyed,
  isFreshlySaved,
  isNewRecord,
  isTitlesUpdating,
  loadMoreCostPerUsePackageTitles,
  model,
  onEdit,
  packageTitles,
  provider,
  proxyTypes,
  searchModal,
  tagsModel,
  toggleSelected,
  updateFolioTags,
  pkgSearchParams,
}) => {
  const stripes = useStripes();
  const intl = useIntl();
  const [showSelectionConfirmationModal, setShowSelectionConfirmationModal] = useState(false);
  const [isExportPackageModalOpen, setIsExportPackageModalOpen] = useState(false);
  const [showDeselectionModal, setShowDeselectionModal] = useState(false);
  const [packageSelected, setPackageSelected] = useState(model.isSelected);
  const [packageAllowedToAddTitles, setPackageAllowedToAddTitles] = useState(model.allowKbToAddTitles);
  const [sections, {
    handleSectionToggle,
    handleExpandAll,
    toggleAllSections,
  }] = useSectionToggle({
    packageShowTags: true,
    packageShowHoldingStatus: true,
    packageShowInformation: true,
    packageShowSettings: true,
    packageShowCoverageSettings: true,
    packageShowAgreements: true,
    packageShowTitles: true,
    packageShowNotes: true,
    packageShowUsageConsolidation: false,
  });
  const titleSearchFilters = useMemo(() => {
    const params = transformQueryParams('titles', omit(pkgSearchParams, ['page', 'count']));
    return qs.stringify(params);
  }, [pkgSearchParams]);

  useEffect(() => {
    if (!model.isSaving) {
      setPackageSelected(model.isSelected);
      setPackageAllowedToAddTitles(model.allowKbToAddTitles);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.isSelected, model.allowKbToAddTitles]);

  const handleSelectionToggle = () => {
    setPackageSelected(!model.isSelected);

    if (model.isSelected) {
      setShowDeselectionModal(true);
    } else {
      setPackageAllowedToAddTitles(true);
      toggleSelected();
    }
  };

  const commitSelectionToggle = () => {
    setShowDeselectionModal(false);
    toggleSelected();
  };

  const cancelSelectionToggle = () => {
    setShowDeselectionModal(false);
    setPackageSelected(model.isSelected);
  };

  const hasEditPermission = () => {
    const hasEditPerm = stripes.hasPerm(RECORDS_EDIT_PERMISSION);

    return !!(hasEditPerm && packageSelected);
  };

  const renderRemoveFromHoldingsButton = (onToggle) => {
    const translationId = model.isCustom
      ? 'ui-eholdings.package.deletePackage'
      : 'ui-eholdings.package.removeFromHoldings';

    return (
      <Button
        data-test-eholdings-package-remove-from-holdings-action
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          handleSelectionToggle();
        }}
      >
        <FormattedMessage id={translationId} />
      </Button>
    );
  };

  const renderExportCSVButton = (onToggle) => {
    return (
      <Button
        data-testid="export-to-csv-button"
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          setIsExportPackageModalOpen(true);
        }}
      >
        <FormattedMessage id="ui-eholdings.package.actionMenu.exportToCSV" />
      </Button>
    );
  };

  const toggleSelectionConfirmationModal = () => {
    setShowSelectionConfirmationModal(!showSelectionConfirmationModal);
  };

  const renderAddToHoldingsButton = (onToggle) => {
    const translationIdEnding = model.isPartiallySelected
      ? 'addAllToHoldings'
      : 'addPackageToHoldings';

    return (
      <IfPermission perm={PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION}>
        <Button
          data-test-eholdings-package-add-to-holdings-action
          data-testid="add-to-holdings-dropdown-button"
          buttonStyle="dropdownItem fullWidth"
          onClick={() => {
            onToggle();
            toggleSelectionConfirmationModal();
          }}
        >
          <FormattedMessage id={`ui-eholdings.${translationIdEnding}`} />
        </Button>
      </IfPermission>
    );
  };

  const getActionMenu = () => {
    const requiredRemovingPermission = model.isCustom
      ? TITLES_PACKAGES_CREATE_DELETE_PERMISSION
      : PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION;

    const hasRequiredRemovingPermission = stripes.hasPerm(requiredRemovingPermission);
    const hasSelectionPermission = stripes.hasPerm(PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION);
    const isAddButtonNeeded = (!packageSelected || model.isPartiallySelected) && hasSelectionPermission;
    const isRemoveButtonNeeded = packageSelected && hasRequiredRemovingPermission;
    const canEdit = hasEditPermission();

    // eslint-disable-next-line react/prop-types
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
        {isRemoveButtonNeeded && renderRemoveFromHoldingsButton(onToggle)}
        {isAddButtonNeeded && renderAddToHoldingsButton(onToggle)}
        {renderExportCSVButton(onToggle)}
      </>
    );
  };

  const handleSelectionConfirmation = () => {
    addPackageToHoldings();
    toggleSelectionConfirmationModal();
  };

  const renderSelectionConfirmationModal = () => {
    return (
      <SelectionModal
        showSelectionModal
        label={<FormattedMessage id="ui-eholdings.selectPackage.confirmationModal.label" />}
        handleDeleteConfirmation={handleSelectionConfirmation}
        cancelSelectionToggle={toggleSelectionConfirmationModal}
        cancelButtonLabel={<FormattedMessage id="ui-eholdings.cancel" />}
        confirmButtonLabel={<FormattedMessage id="ui-eholdings.selectPackage.confirmationModal.confirmationButtonText" />}
      >
        <SafeHTMLMessage id="ui-eholdings.selectPackage.confirmationModal.message" />
      </SelectionModal>
    );
  };

  const getBodyContent = () => {
    return (
      <>
        <HoldingStatus
          id="packageShowHoldingStatus"
          isOpen={sections.packageShowHoldingStatus}
          onToggle={handleSectionToggle}
          onAddToHoldings={toggleSelectionConfirmationModal}
          model={model}
        />

        <PackageInformation
          isOpen={sections.packageShowInformation}
          onToggle={handleSectionToggle}
          model={model}
        />

        <TagsAccordion
          id="packageShowTags"
          model={model}
          onToggle={handleSectionToggle}
          open={sections.packageShowTags}
          tagsModel={tagsModel}
          updateFolioTags={updateFolioTags}
        />

        <PackageSettings
          isOpen={sections.packageShowSettings}
          onToggle={handleSectionToggle}
          model={model}
          proxyTypes={proxyTypes}
          provider={provider}
          accessStatusTypes={accessStatusTypes}
          packageAllowedToAddTitles={packageAllowedToAddTitles}
          packageSelected={packageSelected}
        />

        <CoverageSettings
          isOpen={sections.packageShowCoverageSettings}
          onToggle={handleSectionToggle}
          packageSelected={packageSelected}
          customCoverage={model.customCoverage}
        />

        <AgreementsAccordion
          id="packageShowAgreements"
          stripes={stripes}
          refId={model.id}
          refType={entityAuthorityTypes.PACKAGE}
          isOpen={sections.packageShowAgreements}
          onToggle={handleSectionToggle}
          refName={model.name}
        />

        <NotesSmartAccordion
          id="packageShowNotes"
          open={sections.packageShowNotes}
          onToggle={handleSectionToggle}
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
            onToggle={handleSectionToggle}
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
  };

  const renderTitlesListItem = (item) => {
    return (
      <TitleListItem
        item={item.attributes}
        link={item.attributes && `/eholdings/resources/${item.id}`}
        showSelected
        headingLevel='h4'
      />
    );
  };

  const renderTitlesList = () => {
    return isTitlesUpdating
      ? (
        <div className={styles.titlesUpdatingSpinner}>
          <Icon icon="spinner-ellipsis" />
        </div>
      )
      : (
        <QuerySearchList
          type="package-titles"
          fetch={fetchPackageTitles}
          collection={packageTitles}
          itemHeight={ITEM_HEIGHT}
          notFoundMessage={
            <QueryNotFound type="package-titles">
              <FormattedMessage id="ui-eholdings.notFound" />
            </QueryNotFound>
          }
          renderItem={renderTitlesListItem}
        />
      );
  };

  const modalMessage = model.isCustom
    ? {
      header: <FormattedMessage id="ui-eholdings.package.modal.header.isCustom" />,
      label: intl.formatMessage({ id: 'ui-eholdings.package.modal.header.isCustom' }),
      body: <FormattedMessage id="ui-eholdings.package.modal.body.isCustom" />,
      buttonConfirm: <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm.isCustom" />,
      buttonCancel: <FormattedMessage id="ui-eholdings.package.modal.buttonCancel.isCustom" />
    }
    : {
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
      type: 'success',
    });
  }

  // if coming from destroying a custom or managed title
  // from within custom-package, show a success toast
  if (isDestroyed) {
    toasts.push({
      id: `success-resource-destruction-${model.id}`,
      message: <FormattedMessage id="ui-eholdings.package.toast.isDestroyed" />,
      type: 'success',
    });
  }

  // if coming from saving edits to the package, show a success toast
  if (isFreshlySaved) {
    toasts.push({
      id: `success-package-saved-${model.id}`,
      message: <FormattedMessage id="ui-eholdings.package.toast.isFreshlySaved" />,
      type: 'success',
    });
  }

  return (
    <KeyShortcutsWrapper
      toggleAllSections={toggleAllSections}
      onEdit={onEdit}
      isPermission={hasEditPermission()}
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
        actionMenu={getActionMenu()}
        sections={sections}
        handleExpandAll={handleExpandAll}
        searchModal={searchModal}
        bodyContent={getBodyContent()}
        listType={listTypes.TITLES}
        listSectionId="packageShowTitles"
        onListToggle={handleSectionToggle}
        resultsLength={packageTitles.totalResults}
        renderList={renderTitlesList}
        ariaRole="tablist"
        bodyAriaRole="tab"
      />
      <SelectionModal
        showSelectionModal={showDeselectionModal}
        handleDeleteConfirmation={commitSelectionToggle}
        cancelSelectionToggle={cancelSelectionToggle}
        label={modalMessage.header}
        cancelButtonLabel={modalMessage.buttonCancel}
        confirmButtonLabel={modalMessage.buttonConfirm}
      >
        {modalMessage.body}
      </SelectionModal>
      {showSelectionConfirmationModal && renderSelectionConfirmationModal()}
      <ExportPackageResourcesModal
        recordId={model.id}
        recordType="PACKAGE"
        open={isExportPackageModalOpen}
        onClose={() => setIsExportPackageModalOpen(false)}
        titleSearchFilters={titleSearchFilters}
      />
    </KeyShortcutsWrapper>
  );
};

PackageShow.propTypes = propTypes;

export default PackageShow;
