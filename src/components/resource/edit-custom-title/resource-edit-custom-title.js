import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  Form,
} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  Button,
} from '@folio/stripes/components';

import { coverageStatementDecorator } from '../_fields/coverage-statement';
import { getEmbargoInitial } from '../_fields/custom-embargo';
import { CustomLabelsEditSection } from '../../custom-labels-section';
import DetailsView from '../../details-view';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';
import SelectionModal from '../../selection-modal';
import CoverageSettings from '../components/edit/coverage-settings';
import ResourceSettings from '../components/edit/resource-settings';
import HoldingStatus from '../components/edit/holding-status';
import {
  useSectionToggle,
  useStateCallback,
} from '../../../hooks';

import resourceEditProptypes from '../recource-edit-proptypes';

import {
  processErrors,
  getUserDefinedFields,
  getAccessTypeId,
  getProxyTypesRecords,
  getProxyTypeById,
} from '../../utilities';

import { CustomLabelsAccordion } from '../../../features';

import {
  historyActions,
  coverageStatementExistenceStatuses,
} from '../../../constants';

const focusOnErrors = createFocusDecorator();

const ResourceEditCustomTitle = ({
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

    return {
      isSelected,
      customCoverages,
      coverageStatement,
      hasCoverageStatement,
      customUrl: url,
      proxyId: (matchingProxy?.id || proxy.id).toLowerCase(),
      accessTypeId: getAccessTypeId(model),
      isVisible: !visibilityData.isHidden,
      customEmbargoPeriod: getEmbargoInitial(customEmbargoPeriod),
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
    resourceShowCustomLabels: true,
    resourceShowSettings: true,
    resourceShowCoverageSettings: true,
  });
  const [resourceSelected, setResourceSelected] = useStateCallback(model.isSelected);
  const [initialValues, setInitialValues] = useState(getInitialValuesFromModel());
  const [formValues, setFormValues] = useStateCallback({}); // eslint-disable-line no-unused-vars
  const editFormRef = useRef(null);

  if (model.isSelected !== initialValues.isSelected) {
    setInitialValues({
      ...initialValues,
      isSelected: model.isSelected,
    });
    setResourceSelected(model.isSelected);
  }

  useEffect(() => {
    if (proxyTypes.request.isResolved) {
      setInitialValues(getInitialValuesFromModel());
    }
  }, [proxyTypes.request.isResolved]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemoveResourceFromHoldings = () => {
    setFormValues({
      isSelected: false,
    }, (newFormValues) => {
      handleOnSubmit(newFormValues);
    });
  };

  const cancelSelectionToggle = (change) => {
    closeSelectionModal();

    setResourceSelected(true, () => {
      change('isSelected', true);
    });
  };

  const getActionMenu = () => {
    const hasSelectPermission = stripes.hasPerm('ui-eholdings.package-title.execute');

    if (!hasSelectPermission || !resourceSelected) {
      return null;
    }

    // eslint-disable-next-line react/prop-types
    return ({ onToggle }) => (
      <Button
        data-test-eholdings-remove-resource-from-holdings
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          handleRemoveResourceFromHoldings();
        }}
      >
        <FormattedMessage id="ui-eholdings.resource.actionMenu.removeHolding" />
      </Button>
    );
  };

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
                      resourceIsCustom
                      resourceSelected={resourceSelected}
                    />

                    <CustomLabelsAccordion
                      id="resourceShowCustomLabels"
                      isOpen={sections.resourceShowCustomLabels}
                      onToggle={handleSectionToggle}
                      section={CustomLabelsEditSection}
                    />

                    <ResourceSettings
                      isOpen={sections.resourceShowSettings}
                      getSectionHeader={getSectionHeader}
                      handleSectionToggle={handleSectionToggle}
                      proxyTypes={proxyTypes}
                      model={model}
                      accessStatusTypes={accessStatusTypes}
                      resourceSelected={resourceSelected}
                      resourceIsCustom
                    />

                    <CoverageSettings
                      isOpen={sections.resourceShowCoverageSettings}
                      getSectionHeader={getSectionHeader}
                      handleSectionToggle={handleSectionToggle}
                      resourceSelected={resourceSelected}
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
              modelIsUpdating={model.destroy.isPending}
              handleDeleteConfirmation={handleDeleteConfirmation}
              cancelSelectionToggle={cancelSelectionToggle}
              change={change}
              label={intl.formatMessage({ id: 'ui-eholdings.resource.modal.header' })}
              cancelButtonLabel={intl.formatMessage({ id: 'ui-eholdings.resource.modal.buttonCancel' })}
              confirmButtonLabel={(model.destroy.isPending
                ? <FormattedMessage id="ui-eholdings.resource.modal.buttonWorking" />
                : <FormattedMessage id="ui-eholdings.resource.modal.buttonConfirm" />
              )}
            >
              {
              /*
                we use <= here to account for the case where a user
                selects and then immediately deselects the
                resource
              */
              model.package.titleCount <= 1
                ? (
                  <span data-test-eholdings-deselect-final-title-warning>
                    <FormattedMessage id="ui-eholdings.resource.modal.body.isCustom.lastTitle" />
                  </span>
                )
                : (
                  <span data-test-eholdings-deselect-title-warning>
                    <FormattedMessage id="ui-eholdings.resource.modal.body" />
                  </span>
                )
              }
            </SelectionModal>
          </>
        )}
      />
    </KeyShortcutsWrapper>
  );
};

ResourceEditCustomTitle.propTypes = resourceEditProptypes;

export default ResourceEditCustomTitle;
