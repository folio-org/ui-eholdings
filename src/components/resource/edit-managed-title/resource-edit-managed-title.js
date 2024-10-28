import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import hasIn from 'lodash/hasIn';

import {
  Button,
} from '@folio/stripes/components';

import {
  useStripes,
} from '@folio/stripes/core';

import { coverageStatementDecorator } from '../_fields/coverage-statement';
import Toaster from '../../toaster';
import { getEmbargoInitial } from '../_fields/custom-embargo';
import NavigationModal from '../../navigation-modal';
import DetailsView from '../../details-view';
import { CustomLabelsEditSection } from '../../custom-labels-section';
import { CustomLabelsAccordion } from '../../../features';
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';
import SelectionModal from '../../selection-modal';
import CoverageSettings from '../components/edit/coverage-settings';
import ResourceSettings from '../components/edit/resource-settings';
import HoldingStatus from '../components/edit/holding-status';
import { useSectionToggle } from '../../../hooks';

import resourceEditProptypes from '../recource-edit-proptypes';
import {
  processErrors,
  getUserDefinedFields,
  getAccessTypeId,
  getProxyTypesRecords,
  getProxyTypeById,
} from '../../utilities';
import {
  historyActions,
  coverageStatementExistenceStatuses,
} from '../../../constants';

const focusOnErrors = createFocusDecorator();

const ResourceEditManagedTitle = ({
  closeSelectionModal,
  model,
  proxyTypes,
  accessStatusTypes,
  onCancel,
  showSelectionModal,
  handleDeleteConfirmation,
  handleOnSubmit,
  getFooter,
  getSectionHeader,
}) => {
  const intl = useIntl();

  const getInitialValuesFromModel = useCallback(() => {
    const {
      isSelected,
      visibilityData,
      customCoverages,
      coverageStatement,
      customEmbargoPeriod,
      url,
      proxy,
    } = model;

    const proxyTypesRecords = getProxyTypesRecords(proxyTypes);
    const matchingProxy = getProxyTypeById(proxyTypesRecords, proxy.id);

    const hasCoverageStatement = coverageStatement.length > 0
      ? coverageStatementExistenceStatuses.YES
      : coverageStatementExistenceStatuses.NO;

    const canEditUrl = model.isTitleCustom || model.isPackageCustom;

    return {
      isSelected,
      isVisible: !visibilityData.isHidden,
      customCoverages,
      coverageStatement,
      hasCoverageStatement,
      customUrl: canEditUrl ? url : undefined,
      customEmbargoPeriod: getEmbargoInitial(customEmbargoPeriod),
      proxyId: (matchingProxy?.id || proxy.id).toLowerCase(),
      accessTypeId: getAccessTypeId(model),
      ...getUserDefinedFields(model),
    };
  }, [model, proxyTypes]);

  const stripes = useStripes();
  const [sections, {
    handleSectionToggle,
    toggleAllSections,
    handleExpandAll,
  }] = useSectionToggle({
    resourceShowHoldingStatus: true,
    resourceShowSettings: true,
    resourceShowCoverageSettings: true,
    resourceShowCustomLabels: true,
  });
  const [managedResourceSelected, setManagedResourceSelected] = useState(model.isSelected);
  const [initialValues, setInitialValues] = useState(getInitialValuesFromModel());
  const editFormRef = useRef(null);

  if (model.isSelected !== initialValues.isSelected) {
    setInitialValues({
      ...initialValues,
      isSelected: model.isSelected,
    });
    setManagedResourceSelected(model.isSelected);
  }

  useEffect(() => {
    if (proxyTypes.request.isResolved) {
      setInitialValues(getInitialValuesFromModel());
    }
  }, [proxyTypes.request.isResolved]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleResourceHoldings = (isSelected) => {
    handleOnSubmit({
      isSelected,
    });
  };

  const cancelSelectionToggle = () => {
    closeSelectionModal();
    setManagedResourceSelected(true);
  };

  const getActionMenu = () => {
    const hasSelectPermission = stripes.hasPerm('ui-eholdings.package-title.manage');

    if (!hasSelectPermission) {
      return null;
    }

    // eslint-disable-next-line react/prop-types
    return ({ onToggle }) => (
      <Button
        data-test-eholdings-remove-resource-from-holdings
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          handleToggleResourceHoldings(false);
        }}
      >
        <FormattedMessage id="ui-eholdings.resource.actionMenu.removeHolding" />
      </Button>
    );
  };

  const isSelectInFlight = model.update.isPending && hasIn(model.update.changedAttributes, 'isSelected');

  return (
    <KeyShortcutsWrapper
      toggleAllSections={toggleAllSections}
      formRef={editFormRef.current}
    >
      <Form
        onSubmit={handleOnSubmit}
        decorators={[coverageStatementDecorator, focusOnErrors]}
        mutators={{
          ...arrayMutators,
          removeAll: ([name], state, { changeValue }) => {
            changeValue(state, name, () => ([]));
          },
        }}
        initialValuesEqual={() => true}
        initialValues={initialValues}
        render={({ handleSubmit, pristine, form: { change } }) => (
          <>
            <Toaster
              toasts={processErrors(model)}
              position="bottom"
            />
            <form
              ref={editFormRef}
              onSubmit={handleSubmit}
            >
              <DetailsView
                type="resource"
                actionMenu={getActionMenu()}
                model={model}
                paneTitle={model.title.name}
                paneSub={model.package.name}
                handleExpandAll={handleExpandAll}
                sections={sections}
                footer={getFooter(pristine)}
                onCancel={onCancel}
                bodyContent={(
                  <>
                    <HoldingStatus
                      isOpen={sections.resourceShowHoldingStatus}
                      getSectionHeader={getSectionHeader}
                      handleSectionToggle={handleSectionToggle}
                      model={model}
                      resourceIsCustom={false}
                      resourceSelected={managedResourceSelected}
                      isSelectInFlight={isSelectInFlight}
                    />

                    {model.isSelected && (
                      <CustomLabelsAccordion
                        id="resourceShowCustomLabels"
                        isOpen={sections.resourceShowCustomLabels}
                        onToggle={handleSectionToggle}
                        section={CustomLabelsEditSection}
                      />
                    )}

                    {managedResourceSelected && (
                      <ResourceSettings
                        isOpen={sections.resourceShowSettings}
                        getSectionHeader={getSectionHeader}
                        handleSectionToggle={handleSectionToggle}
                        proxyTypes={proxyTypes}
                        model={model}
                        accessStatusTypes={accessStatusTypes}
                        resourceSelected={managedResourceSelected}
                      />
                    )}

                    <CoverageSettings
                      isOpen={sections.resourceShowCoverageSettings}
                      getSectionHeader={getSectionHeader}
                      handleSectionToggle={handleSectionToggle}
                      resourceSelected={managedResourceSelected}
                      model={model}
                    />
                  </>
              )}
              />
            </form>

            <NavigationModal
              historyAction={historyActions.REPLACE}
              when={!pristine && !model.update.isPending && !model.update.isResolved}
            />

            <SelectionModal
              showSelectionModal={showSelectionModal}
              modelIsUpdating={model.update.isPending}
              handleDeleteConfirmation={handleDeleteConfirmation}
              cancelSelectionToggle={cancelSelectionToggle}
              change={change}
              label={intl.formatMessage({ id: 'ui-eholdings.resource.modal.header' })}
              cancelButtonLabel={intl.formatMessage({ id: 'ui-eholdings.resource.modal.buttonCancel' })}
              confirmButtonLabel={(model.update.isPending
                ? <FormattedMessage id="ui-eholdings.resource.modal.buttonWorking" />
                : <FormattedMessage id="ui-eholdings.resource.modal.buttonConfirm" />
              )}
            >
              <FormattedMessage id="ui-eholdings.resource.modal.body" />
            </SelectionModal>
          </>
        )}
      />
    </KeyShortcutsWrapper>
  );
};

ResourceEditManagedTitle.propTypes = resourceEditProptypes;

export default ResourceEditManagedTitle;
