import {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import DetailsView from '../details-view';
import {
  AgreementsAccordion,
  CustomLabelsAccordion,
  UsageConsolidationAccordion,
  ExportPackageResourcesModal,
} from '../../features';
import { useSectionToggle } from '../../hooks';
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

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
  costPerUse: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  fetchResourceCostPerUse: PropTypes.func.isRequired,
  isFreshlySaved: PropTypes.bool,
  model: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  proxyTypes: PropTypes.object.isRequired,
  tagsModel: PropTypes.object,
  toggleSelected: PropTypes.func.isRequired,
  updateFolioTags: PropTypes.func.isRequired,
};

const ResourceShow = ({
  accessStatusTypes,
  costPerUse,
  fetchResourceCostPerUse,
  isFreshlySaved,
  model,
  onEdit,
  proxyTypes,
  tagsModel,
  toggleSelected,
  updateFolioTags,
}) => {
  const stripes = useStripes();
  const intl = useIntl();

  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [isExportPackageModalOpen, setIsExportPackageModalOpen] = useState(false);
  const [resourceSelected, setResourceSelected] = useState(model.isSelected);
  const [sections, {
    handleSectionToggle,
    handleExpandAll,
    toggleAllSections,
  }] = useSectionToggle({
    resourceShowTags: true,
    resourceShowHoldingStatus: true,
    resourceShowInformation: true,
    resourceShowCustomLabels: true,
    resourceShowSettings: true,
    resourceShowCoverageSettings: true,
    resourceShowAgreements: true,
    resourceShowNotes: true,
    resourceShowUsageConsolidation: false,
  });

  useEffect(() => {
    if (!model.isSaving) {
      setResourceSelected(model.isSelected);
    }
  }, [model.isSaving, model.isSelected]);

  const hasEditPermission = () => {
    const hasRecordsEditPermission = stripes.hasPerm(RECORDS_EDIT_PERMISSION);
    const hasCreateAndDeletePermission = stripes.hasPerm(TITLES_PACKAGES_CREATE_DELETE_PERMISSION);

    return ((hasRecordsEditPermission || hasCreateAndDeletePermission) && resourceSelected);
  };

  const handleHoldingStatus = () => {
    if (model.isSelected) {
      setShowSelectionModal(true);
    } else {
      toggleSelected();
    }
  };

  const commitSelectionToggle = () => {
    setShowSelectionModal(false);
    setResourceSelected(false);
    toggleSelected();
  };

  const cancelSelectionToggle = () => {
    setShowSelectionModal(false);
    setResourceSelected(model.isSelected);
  };

  const renderSelectionButton = (onToggle) => {
    const selectionButtonMessage = resourceSelected
      ? 'ui-eholdings.resource.actionMenu.removeHolding'
      : 'ui-eholdings.resource.actionMenu.addHolding';

    return (
      <Button
        data-test-eholdings-toggle-resource-holdings
        data-testid="toggle-resource-holdings"
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          handleHoldingStatus();
        }}
      >
        <FormattedMessage id={selectionButtonMessage} />
      </Button>
    );
  };

  const renderExportCSVButton = (onToggle) => {
    return (
      <Button
        data-testid="export-to-csv-button"
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          setIsExportPackageModalOpen(true);
          onToggle();
        }}
      >
        <FormattedMessage id="ui-eholdings.resource.actionMenu.exportToCSV" />
      </Button>
    );
  };

  const getActionMenu = () => {
    const hasCreateAndDeletePermission = stripes.hasPerm(TITLES_PACKAGES_CREATE_DELETE_PERMISSION);
    const hasSelectionPermission = stripes.hasPerm(PACKAGE_TITLE_SELECT_UNSELECT_PERMISSION);
    const canEdit = hasEditPermission();
    const canSelectAndUnselect = hasSelectionPermission || hasCreateAndDeletePermission;

    // eslint-disable-next-line react/prop-types
    return ({ onToggle }) => (
      <>
        {canEdit &&
          <Button
            buttonStyle="dropdownItem fullWidth"
            data-test-eholdings-resource-edit-link
            onClick={onEdit}
          >
            <FormattedMessage id="ui-eholdings.actionMenu.edit" />
          </Button>
        }
        {canSelectAndUnselect && renderSelectionButton(onToggle)}
        {/* renderExportCSVButton(onToggle) TODO: uncomment to enable export functionality, and don't forget to enable tests too */}
      </>
    );
  };

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
      type: 'success',
    });
  }

  return (
    <KeyShortcutsWrapper
      toggleAllSections={toggleAllSections}
      onEdit={onEdit}
      isPermission={hasEditPermission()}
    >
      <Toaster toasts={toasts} position="bottom" />

      <DetailsView
        type="resource"
        model={model}
        paneTitle={model.title.name}
        paneSub={model.package.name}
        actionMenu={getActionMenu()}
        sections={sections}
        handleExpandAll={handleExpandAll}
        ariaRole="tablist"
        bodyAriaRole="tab"
        bodyContent={(
          <>
            <HoldingStatus
              isOpen={sections.resourceShowHoldingStatus}
              onToggle={handleSectionToggle}
              onAddToHoldings={handleHoldingStatus}
              model={model}
              resourceSelected={resourceSelected}
            />

            <ResourceInformation
              isOpen={sections.resourceShowInformation}
              onToggle={handleSectionToggle}
              model={model}
            />

            <TagsAccordion
              id="resourceShowTags"
              model={model}
              onToggle={handleSectionToggle}
              open={sections.resourceShowTags}
              tagsModel={tagsModel}
              updateFolioTags={updateFolioTags}
            />

            <ResourceSettings
              isOpen={sections.resourceShowSettings}
              onToggle={handleSectionToggle}
              model={model}
              resourceSelected={resourceSelected}
              accessStatusTypes={accessStatusTypes}
              proxyTypes={proxyTypes}
            />

            <CoverageSettings
              isOpen={sections.resourceShowCoverageSettings}
              onToggle={handleSectionToggle}
              model={model}
              resourceSelected={resourceSelected}
            />

            {showCustomLables &&
              <CustomLabelsAccordion
                id="resourceShowCustomLabels"
                isOpen={sections.resourceShowCustomLabels}
                onToggle={handleSectionToggle}
                section={CustomLabelsShowSection}
                userDefinedFields={userDefinedFields}
              />}

            <AgreementsAccordion
              id="resourceShowAgreements"
              stripes={stripes}
              refId={model.id}
              refType={entityAuthorityTypes.RESOURCE}
              isOpen={sections.resourceShowAgreements}
              onToggle={handleSectionToggle}
              refName={model.title.name}
            />

            <NotesSmartAccordion
              id="resourceShowNotes"
              open={sections.resourceShowNotes}
              onToggle={handleSectionToggle}
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
                onToggle={handleSectionToggle}
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
        data-testid="selection-modal"
        aria-label={intl.formatMessage({ id: 'ui-eholdings.resource.show.modal.header' })}
        footer={(
          <ModalFooter>
            <Button
              data-test-eholdings-resource-deselection-confirmation-modal-yes
              data-testid="resource-deselection-confirmation-yes"
              buttonStyle="primary"
              onClick={commitSelectionToggle}
            >
              <FormattedMessage id="ui-eholdings.resource.modal.buttonConfirm" />
            </Button>
            <Button
              data-test-eholdings-resource-deselection-confirmation-modal-no
              data-testid="resource-deselection-confirmation-no"
              onClick={cancelSelectionToggle}
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
      <ExportPackageResourcesModal
        recordId={model.id}
        recordType="RESOURCE"
        open={isExportPackageModalOpen}
        onClose={() => setIsExportPackageModalOpen(false)}
      />
    </KeyShortcutsWrapper>
  );
};

ResourceShow.propTypes = propTypes;

export default ResourceShow;
