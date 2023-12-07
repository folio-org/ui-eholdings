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
import SelectionModal from '../../selection-modal';
import KeyShortcutsWrapper from '../../key-shortcuts-wrapper';
import HoldingStatus from '../show/components/holding-status';
import EditPackageInformation from '../edit/components/edit-package-information';
import EditPackageSettings from '../edit/components/edit-package-settings';
import EditCoverageSettings from '../edit/components/edit-coverage-settings';
import EditPaneFooter from '../edit/components/edit-pane-footer';
import {
  useStateCallback,
  useSectionToggle,
} from '../../../hooks';

import {
  accessTypesReduxStateShape,
  TITLES_PACKAGES_CREATE_DELETE_PERMISSION,
} from '../../../constants';

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

const CustomPackageEdit = ({
  model,
  proxyTypes,
  provider,
  onCancel,
  onSubmit,
  accessStatusTypes,
  addPackageToHoldings,
}) => {
  const stripes = useStripes();
  const intl = useIntl();

  const getInitialValues = useCallback(() => {
    const {
      name,
      contentType,
      isSelected,
      customCoverage,
      proxy,
      visibilityData,
    } = model;

    const proxyTypesRecords = getProxyTypesRecords(proxyTypes);
    const matchingProxy = getProxyTypeById(proxyTypesRecords, proxy.id);

    return {
      name,
      contentType,
      isSelected,
      customCoverages: [{
        ...customCoverage,
      }],
      proxyId: (matchingProxy?.id || proxy.id).toLowerCase(),
      isVisible: !visibilityData.isHidden,
      accessTypeId: getAccessTypeId(model),
    };
  }, [model, proxyTypes]);

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
    packageInfo: true,
    packageSettings: true,
    packageCoverageSettings: true,
  });
  const editFormRef = useRef(null);

  if (model.isSelected !== initialValues.isSelected) {
    setInitialValues(getInitialValues());
    setPackageSelected(model.isSelected);
  }

  const isProxyTypesLoaded = proxyTypes.request.isResolved && provider.data.isLoaded;

  useEffect(() => {
    if (isProxyTypesLoaded) {
      setInitialValues(getInitialValues());
    }
  }, [isProxyTypesLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  if (model.destroy.errors.length) {
    setShowSelectionModal(false);
  }

  const cancelSelectionToggle = (change) => {
    setShowSelectionModal(false);
    setPackageSelected(true, () => change('isSelected', true));
  };

  const handleOnSubmit = (values, allowSubmit = allowFormToSubmit) => {
    if (allowSubmit === false && values.isSelected === false) {
      setShowSelectionModal(true);
      setFormValues(values);
    } else {
      setAllowFormToSubmit(false);
      setFormValues({}, () => onSubmit(values));
    }
  };

  const handleDeleteAction = () => {
    setFormValues({
      isSelected: false,
    }, (newFormValues) => handleOnSubmit(newFormValues));
  };

  const commitSelectionToggle = () => {
    setAllowFormToSubmit({
      allowFormToSubmit: true
    }, () => handleOnSubmit(formValues, true));
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

  const getActionMenu = () => {
    const hasDeletePermission = stripes.hasPerm(TITLES_PACKAGES_CREATE_DELETE_PERMISSION);

    if (!hasDeletePermission || !packageSelected) return null;

    // eslint-disable-next-line react/prop-types
    return ({ onToggle }) => (
      <Button
        data-test-eholdings-package-remove-from-holdings-action
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          handleDeleteAction();
        }}
      >
        <FormattedMessage id="ui-eholdings.package.deletePackage" />
      </Button>
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
      toggleAllSections={toggleAllSections}
      formRef={editFormRef.current}
    >
      <Form
        onSubmit={handleOnSubmit}
        decorators={[focusOnErrors]}
        mutators={{ ...arrayMutators }}
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
              noValidate
            >
              <DetailsView
                type="package"
                model={model}
                paneTitle={model.name}
                actionMenu={getActionMenu()}
                handleExpandAll={toggleAllSections}
                sections={sections}
                ariaRole="tablist"
                bodyAriaRole="tab"
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
                    <EditPackageInformation
                      isOpen={sections.packageInfo}
                      onToggle={handleSectionToggle}
                      getSectionHeader={getSectionHeader}
                      packageSelected={packageSelected}
                      model={model}
                    />
                    <EditPackageSettings
                      isOpen={sections.packageSettings}
                      getSectionHeader={getSectionHeader}
                      onToggle={handleSectionToggle}
                      packageSelected={packageSelected}
                      initialValues={initialValues}
                      model={model}
                      proxyTypes={proxyTypes}
                      provider={provider}
                      packageIsCustom
                      accessStatusTypes={accessStatusTypes}
                    />

                    <EditCoverageSettings
                      isOpen={sections.packageCoverageSettings}
                      getSectionHeader={getSectionHeader}
                      onToggle={handleSectionToggle}
                      packageSelected={packageSelected}
                      initialValues={initialValues}
                      packageIsCustom
                    />
                  </>
                )}
                onCancel={onCancel}
              />
            </form>

            <NavigationModal when={!pristine && !model.update.isPending && !model.update.isResolved} />

            <SelectionModal
              showSelectionModal={showSelectionModal}
              modelIsUpdating={model.destroy.isPending}
              handleDeleteConfirmation={commitSelectionToggle}
              cancelSelectionToggle={cancelSelectionToggle}
              change={change}
              label={intl.formatMessage({ id: 'ui-eholdings.package.modal.header.isCustom' })}
              cancelButtonLabel={intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonCancel.isCustom' })}
              confirmButtonLabel={(model.destroy.isPending
                ? <FormattedMessage id="ui-eholdings.package.modal.buttonWorking.isCustom" />
                : <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm.isCustom" />
              )}
            >
              <FormattedMessage id="ui-eholdings.package.modal.body.isCustom" />
            </SelectionModal>
          </>
        )}
      />
    </KeyShortcutsWrapper>
  );
};

CustomPackageEdit.propTypes = propTypes;

export default CustomPackageEdit;
