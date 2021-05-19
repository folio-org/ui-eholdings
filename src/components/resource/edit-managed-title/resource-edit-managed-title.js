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
} from 'react-intl';

import hasIn from 'lodash/hasIn';

import {
  Button,
} from '@folio/stripes/components';

import {
  useStripes,
} from '@folio/stripes-core';

import { coverageStatementDecorator } from '../_fields/coverage-statement';
import Toaster from '../../toaster';
import { getEmbargoInitial } from '../_fields/custom-embargo';
import NavigationModal from '../../navigation-modal';
import DetailsView from '../../details-view';
import { CustomLabelsEditSection } from '../../custom-labels-section';
import { CustomLabelsAccordion } from '../../../features';
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';
import SelectionModal from '../components/selection-modal';
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
  handelDeleteConfirmation,
  handleOnSubmit,
  getFooter,
  getSectionHeader,
}) => {
  const getInitialValuesFromModel = useCallback(() => {
    const {
      isSelected,
      visibilityData,
      customCoverages,
      coverageStatement,
      customEmbargoPeriod,
      proxy,
    } = model;

    const proxyTypesRecords = getProxyTypesRecords(proxyTypes);
    const matchingProxy = getProxyTypeById(proxyTypesRecords, proxy.id);

    const hasCoverageStatement = coverageStatement.length > 0
      ? coverageStatementExistenceStatuses.YES
      : coverageStatementExistenceStatuses.NO;

    return {
      isSelected,
      isVisible: !visibilityData.isHidden,
      customCoverages,
      coverageStatement,
      hasCoverageStatement,
      customEmbargoPeriod: getEmbargoInitial(customEmbargoPeriod),
      proxyId: (matchingProxy?.id || proxy.id).toLowerCase(),
      accessTypeId: getAccessTypeId(model),
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
  }, [proxyTypes.request.isResolved, getInitialValuesFromModel]);

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
    const hasSelectPermission = stripes.hasPerm('ui-eholdings.package-title.select-unselect');

    if (!hasSelectPermission) return null;

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

  const userDefinedFields = getUserDefinedFields(model);

  return (
    <KeyShortcutsWrapper
      formRef={editFormRef.current}
      toggleAllSections={toggleAllSections}
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
        render={({ handleSubmit, pristine, form: { change, reset } }) => (
          <div>
            <Toaster toasts={processErrors(model)} position="bottom" />
            <form
              ref={editFormRef}
              onSubmit={handleSubmit}
            >
              <DetailsView
                type="resource"
                model={model}
                paneTitle={model.title.name}
                paneSub={model.package.name}
                actionMenu={getActionMenu()}
                handleExpandAll={handleExpandAll}
                sections={sections}
                footer={getFooter(pristine, reset)}
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
                      handleToggleResourceHoldings={handleToggleResourceHoldings}
                    />

                    {model.isSelected && (
                      <CustomLabelsAccordion
                        id="resourceShowCustomLabels"
                        isOpen={sections.resourceShowCustomLabels}
                        onToggle={handleSectionToggle}
                        section={CustomLabelsEditSection}
                        userDefinedFields={userDefinedFields}
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
              handelDeleteConfirmation={handelDeleteConfirmation}
              cancelSelectionToggle={cancelSelectionToggle}
              change={change}
            >
              <FormattedMessage id="ui-eholdings.resource.modal.body" />
            </SelectionModal>
          </div>
        )}
      />
    </KeyShortcutsWrapper>
  );
};

ResourceEditManagedTitle.propTypes = resourceEditProptypes;

export default ResourceEditManagedTitle;
