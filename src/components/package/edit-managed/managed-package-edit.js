import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  Button,
  Headline,
} from '@folio/stripes/components';

import {
  processErrors,
  getAccessTypeId,
  getProxyTypesRecords,
  getProxyTypeById,
} from '../../utilities';

import DetailsView from '../../details-view';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';
import HoldingStatus from '../show/components/holding-status';
import EditCoverageSettings from '../edit/components/edit-coverage-settings';
import SelectionModal from '../../selection-modal';
import EditPackageSettings from '../edit/components/edit-package-settings';
import EditPaneFooter from '../edit/components/edit-pane-footer';

import {
  useSectionToggle,
  useStateCallback,
} from '../../../hooks';
import { accessTypesReduxStateShape } from '../../../constants';

const focusOnErrors = createFocusDecorator();

const propTypes = {
  accessStatusTypes: accessTypesReduxStateShape.isRequired,
  addPackageToHoldings: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  provider: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired,
};

const ManagedPackageEdit = ({
  accessStatusTypes,
  addPackageToHoldings,
  model,
  onCancel,
  onSubmit,
  provider,
  proxyTypes,
}) => {
  const stripes = useStripes();
  const intl = useIntl();

  const getInitialValues = useCallback(() => {
    const {
      isSelected,
      customCoverage,
      proxy,
      packageToken,
      visibilityData,
      allowKbToAddTitles,
    } = model;

    const proxyTypesRecords = getProxyTypesRecords(proxyTypes);
    const matchingProxy = getProxyTypeById(proxyTypesRecords, proxy.id);

    return {
      isSelected,
      customCoverages: [{
        ...customCoverage,
      }],
      proxyId: (matchingProxy?.id || proxy.id).toLowerCase(),
      providerTokenValue: provider.providerToken.value,
      packageTokenValue: packageToken.value,
      isVisible: !visibilityData.isHidden,
      allowKbToAddTitles,
      accessTypeId: getAccessTypeId(model),
    };
  }, [model, provider.providerToken.value, proxyTypes]);

  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [allowFormToSubmit, setAllowFormToSubmit] = useStateCallback(false);
  const [packageSelected, setPackageSelected] = useStateCallback(model.isSelected);
  const [formValues, setFormValues] = useStateCallback({});
  const [initialValues, setInitialValues] = useState(getInitialValues());
  const [sections, {
    handleSectionToggle,
    toggleAllSections,
  }] = useSectionToggle({
    packageHoldingStatus: true,
    packageSettings: true,
    packageCoverageSettings: true,
  });
  const editFormRef = useRef(null);

  const isProxyTypesLoaded = proxyTypes.request.isResolved && provider.data.isLoaded;

  useEffect(() => {
    if (isProxyTypesLoaded) {
      setInitialValues(getInitialValues());
    }
  }, [isProxyTypesLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const providerTokenWasLoaded = !initialValues.providerTokenValue && provider.providerToken.value;
  const selectionStatusChanged = model.isSelected !== initialValues.isSelected;

  if (selectionStatusChanged || providerTokenWasLoaded) {
    setInitialValues(getInitialValues());
    setPackageSelected(model.isSelected);
  }

  if (model.update.errors.length) {
    setShowSelectionModal(false);
  }

  const handleOnSubmit = (values, allowSubmit = allowFormToSubmit) => {
    if (allowSubmit === false && values.isSelected === false) {
      setShowSelectionModal(true);
      setFormValues(values);
    } else {
      setAllowFormToSubmit(false);
      setFormValues({}, () => onSubmit(values));
    }
  };

  const handleDeselectionAction = () => {
    setFormValues({
      isSelected: false,
    }, (newFormValues) => handleOnSubmit(newFormValues));
  };

  const commitSelectionToggle = () => {
    setAllowFormToSubmit(true, () => handleOnSubmit(formValues, true));
  };

  const cancelSelectionToggle = (change) => {
    setShowSelectionModal(false);
    setPackageSelected(true, () => change('isSelected', true));
  };

  const getSectionHeader = (translationKey) => {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id={translationKey} />
      </Headline>
    );
  };

  const renderRemoveFromHoldingsButton = (onToggle) => {
    return (
      <Button
        data-test-eholdings-package-remove-from-holdings-action
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          handleDeselectionAction();
        }}
      >
        <FormattedMessage id="ui-eholdings.package.removeFromHoldings" />
      </Button>
    );
  };

  const renderAddToHoldingsButton = (onToggle) => {
    const translationIdEnding = model.isPartiallySelected
      ? 'addAllToHoldings'
      : 'addPackageToHoldings';

    return (
      <Button
        data-test-eholdings-package-add-to-holdings-action
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          addPackageToHoldings();
        }}
      >
        <FormattedMessage
          id={`ui-eholdings.${translationIdEnding}`}
        />
      </Button>
    );
  };

  const getActionMenu = () => {
    const isAddButtonNeeded = !packageSelected || model.isPartiallySelected;
    const hasSelectPermission = stripes.hasPerm('ui-eholdings.package-title.select-unselect');

    if (!hasSelectPermission) return null;

    // eslint-disable-next-line react/prop-types
    return ({ onToggle }) => (
      <>
        {packageSelected && renderRemoveFromHoldingsButton(onToggle)}
        {isAddButtonNeeded && renderAddToHoldingsButton(onToggle)}
      </>
    );
  };

  const getFooter = (pristine) => {
    return (
      <EditPaneFooter
        disabled={model.update.isPending || pristine}
        onCancel={onCancel}
      />
    );
  };

  return (
    <KeyShortcutsWrapper
      formRef={editFormRef.current}
      toggleAllSections={toggleAllSections}
    >
      <Form
        onSubmit={handleOnSubmit}
        decorators={[focusOnErrors]}
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        render={({
          handleSubmit,
          pristine,
          form: { change },
        }) => (
          <>
            <Toaster
              toasts={processErrors(model)}
              position="bottom"
            />
            <form
              ref={editFormRef}
              onSubmit={handleSubmit}
              data-testid="managed-package-edit"
            >
              <div role="tablist">
                <DetailsView
                  type="package"
                  model={model}
                  paneTitle={model.name}
                  actionMenu={getActionMenu()}
                  handleExpandAll={toggleAllSections}
                  sections={sections}
                  footer={getFooter(pristine)}
                  bodyContent={(
                    <>
                      <HoldingStatus
                        id="packageHoldingStatus"
                        isOpen={sections.packageHoldingStatus}
                        onToggle={handleSectionToggle}
                        model={model}
                        onAddToHoldings={addPackageToHoldings}
                      />
                      {packageSelected && (
                        <>
                          <EditPackageSettings
                            isOpen={sections.packageSettings}
                            getSectionHeader={getSectionHeader}
                            onToggle={handleSectionToggle}
                            packageSelected={packageSelected}
                            initialValues={initialValues}
                            model={model}
                            proxyTypes={proxyTypes}
                            provider={provider}
                            accessStatusTypes={accessStatusTypes}
                          />

                          <EditCoverageSettings
                            isOpen={sections.packageCoverageSettings}
                            getSectionHeader={getSectionHeader}
                            onToggle={handleSectionToggle}
                            packageSelected={packageSelected}
                            initialValues={initialValues}
                          />
                        </>
                      )}
                    </>
                  )}
                  onCancel={onCancel}
                />
              </div>
            </form>

            <NavigationModal when={!pristine && !model.update.isPending && !model.update.isResolved} />

            <SelectionModal
              showSelectionModal={showSelectionModal}
              modelIsUpdating={model.update.isPending}
              handleDeleteConfirmation={commitSelectionToggle}
              cancelSelectionToggle={cancelSelectionToggle}
              change={change}
              label={intl.formatMessage({ id: 'ui-eholdings.package.modal.header' })}
              cancelButtonLabel={intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonCancel' })}
              confirmButtonLabel={(model.update.isPending
                ? <FormattedMessage id="ui-eholdings.package.modal.buttonWorking" />
                : <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm" />
              )}
            >
              <FormattedMessage id="ui-eholdings.package.modal.body" />
            </SelectionModal>
          </>
        )}
      />
    </KeyShortcutsWrapper>
  );
};

ManagedPackageEdit.propTypes = propTypes;

export default ManagedPackageEdit;
