import PropTypes from 'prop-types';
import {
  Field,
} from 'react-final-form';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
  Headline,
  Icon,
  RadioButton,
} from '@folio/stripes/components';

import TokenField from '../../../../token';
import AccessTypeEditSection from '../../../../access-type-edit-section';
import ProxySelectField from '../../../../proxy-select';

import fieldsetStyles from '../../../../fieldset-styles.css';
import styles from './edit-package-settings.css';

const propTypes = {
  accessStatusTypes: PropTypes.object,
  getSectionHeader: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  packageIsCustom: PropTypes.bool,
  packageSelected: PropTypes.bool.isRequired,
  provider: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired,
};

const defaultProps = {
  accessStatusTypes: {},
  packageIsCustom: false,
};

const EditPackageSettings = ({
  getSectionHeader,
  isOpen,
  onToggle,
  packageSelected,
  initialValues,
  proxyTypes,
  provider,
  packageIsCustom,
  accessStatusTypes,
  model,
}) => {
  const visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;
  const supportsProviderTokens = provider && provider.isLoaded && provider.providerToken && provider.providerToken.prompt;
  const supportsPackageTokens = model && model.isLoaded && model.packageToken && model.packageToken.prompt;
  const hasProviderTokenValue = provider && provider.isLoaded && provider.providerToken && provider.providerToken.value;
  const hasPackageTokenValue = model && model.isLoaded && model.packageToken && model.packageToken.value;

  const renderVisibilityRadios = () => {
    return (
      <fieldset
        data-test-eholdings-package-visibility-field
        className={styles['visibility-radios']}
      >
        <Headline tag="legend" size="small" margin="x-large">
          <FormattedMessage id="ui-eholdings.package.visibility" />
        </Headline>
        <Field
          component={RadioButton}
          format={value => typeof value !== 'undefined' && value !== null && value.toString()}
          label={<FormattedMessage id="ui-eholdings.yes" />}
          name="isVisible"
          parse={value => value === 'true'}
          type="radio"
          value="true"
        />
        <Field
          component={RadioButton}
          format={value => typeof value !== 'undefined' && value !== null && value.toString()}
          label={
            <FormattedMessage
              id="ui-eholdings.package.visibility.no"
              values={{ visibilityMessage }}
            />
          }
          name="isVisible"
          parse={value => value === 'true'}
          type="radio"
          value="false"
        />
      </fieldset>
    );
  };

  const renderTitleManagementRadios = () => {
    return (
      <fieldset
        data-test-eholdings-allow-kb-to-add-titles-radios
        className={fieldsetStyles.fieldset}
      >
        <Headline
          tag="legend"
          className={fieldsetStyles.label}
        >
          <FormattedMessage id="ui-eholdings.package.packageAllowToAddTitles" />
        </Headline>
        <Field
          data-test-eholdings-allow-kb-to-add-titles-radio-yes
          component={RadioButton}
          format={value => typeof value !== 'undefined' && value !== null && value.toString()}
          label={<FormattedMessage id="ui-eholdings.yes" />}
          name="allowKbToAddTitles"
          parse={value => value === 'true'}
          type="radio"
          value="true"
        />
        <Field
          data-test-eholdings-allow-kb-to-add-titles-radio-no
          component={RadioButton}
          format={value => typeof value !== 'undefined' && value !== null && value.toString()}
          label={<FormattedMessage id="ui-eholdings.no" />}
          name="allowKbToAddTitles"
          parse={value => value === 'true'}
          type="radio"
          value="false"
        />
      </fieldset>
    );
  };

  const renderAccordionContent = () => {
    if (packageIsCustom && !packageSelected) {
      return <p><FormattedMessage id="ui-eholdings.package.packageSettings.notSelected" /></p>;
    }

    return (
      <>
        <div className={styles['visibility-radios']}>
          {initialValues.isVisible !== null
            ? renderVisibilityRadios()
            : (
              <div
                data-test-eholdings-package-details-visibility
                htmlFor="managed-package-details-visibility-switch"
              >
                <Icon icon="spinner-ellipsis" />
              </div>
            )
          }
        </div>
        {!packageIsCustom && (
          <div className={styles['title-management-radios']}>
            {initialValues.allowKbToAddTitles !== null
              ? renderTitleManagementRadios()
              : (
                <div
                  data-test-eholdings-package-details-allow-add-new-titles
                  htmlFor="managed-package-details-toggle-allow-add-new-titles-switch"
                >
                  <Icon icon="spinner-ellipsis" />
                </div>
              )
            }
          </div>
        )}
        {(proxyTypes.request.isResolved && provider.data.isLoaded)
          ? (
            <div data-test-eholdings-package-proxy-select-field>
              <ProxySelectField
                proxyTypes={proxyTypes}
                inheritedProxyId={provider.proxy.id}
              />
            </div>
          ) : (
            <Icon icon="spinner-ellipsis" />
          )
        }
        {!packageIsCustom && (
          <>
            <AccessTypeEditSection accessStatusTypes={accessStatusTypes} />
            {supportsProviderTokens && (
              <fieldset>
                <Headline tag="legend" id="provider-token-label">
                  <FormattedMessage id="ui-eholdings.provider.token" />
                </Headline>
                <TokenField
                  token={provider.providerToken}
                  tokenValue={hasProviderTokenValue}
                  type="provider"
                  ariaLabelledBy="provider-token-label"
                />
              </fieldset>
            )}
            {supportsPackageTokens && (
              <fieldset>
                <Headline tag="legend" id="package-token-label">
                  <FormattedMessage id="ui-eholdings.package.token" />
                </Headline>
                <TokenField
                  token={model.packageToken}
                  tokenValue={hasPackageTokenValue}
                  type="package"
                  ariaLabelledBy="package-token-label"
                />
              </fieldset>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <Accordion
      label={getSectionHeader('ui-eholdings.package.packageSettings')}
      open={isOpen}
      id="packageSettings"
      onToggle={onToggle}
    >
      {renderAccordionContent()}
    </Accordion>
  );
};

EditPackageSettings.propTypes = propTypes;
EditPackageSettings.defaultProps = defaultProps;

export default EditPackageSettings;
