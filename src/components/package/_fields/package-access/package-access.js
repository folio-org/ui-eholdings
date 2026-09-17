import { Field } from 'react-final-form';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import {
  Headline,
  InfoPopover,
  RadioButton,
} from '@folio/stripes/components';

import fieldsetStyles from '../../../fieldset-styles.css';

export const PackageAccess = () => {
  const intl = useIntl();

  return (
    <fieldset
      data-testid="package-access-fieldset"
      className={fieldsetStyles.fieldset}
    >
      <Headline
        tag="legend"
        className={fieldsetStyles.label}
      >
        <FormattedMessage id="ui-eholdings.package.packageAccess" />
        <InfoPopover
          iconSize="small"
          content={intl.formatMessage({ id: 'ui-eholdings.package.packageAccess.infoPopover' })}
        />
      </Headline>
      <Field
        component={RadioButton}
        format={value => value?.toString()}
        label={<FormattedMessage id="ui-eholdings.package.controlled" />}
        name="isFreeAccess"
        parse={value => value === 'true'}
        type="radio"
        value="false"
      />
      <Field
        component={RadioButton}
        format={value => value?.toString()}
        label={<FormattedMessage id="ui-eholdings.package.public" />}
        name="isFreeAccess"
        parse={value => value === 'true'}
        type="radio"
        value="true"
      />
    </fieldset>
  );
};
