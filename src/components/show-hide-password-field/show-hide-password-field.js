import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Button,
  TextField,
} from '@folio/stripes/components';

import css from './show-hide-password-field.css';

const propTypes = {
  field: PropTypes.node.isRequired,
  hideButtonLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  isHiddenBeDefault: PropTypes.bool,
  showButton: PropTypes.bool,
  showButtonLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

const defaultProps = {
  isHiddenBeDefault: true,
  showButton: true,
  showButtonLabel: <FormattedMessage id="ui-eholdings.showHidePasswordField.show" />,
  hideButtonLabel: <FormattedMessage id="ui-eholdings.showHidePasswordField.hide" />,
};

const ShowHidePasswordField = ({
  field: Field,
  isHiddenBeDefault,
  showButtonLabel,
  hideButtonLabel,
  showButton,
  ...rest
}) => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(isHiddenBeDefault);

  const handleButtonClick = () => {
    setIsPasswordHidden(cur => !cur);
  };

  return (
    <div className={css.showHidePasswordField}>
      <Field
        type={isPasswordHidden ? 'password' : 'text'}
        autoComplete="new-password"
        component={TextField}
        className={css.showHideTextField}
        marginBottom0
        {...rest}
      />
      {showButton
        ? (
          <Button
            buttonClass={css.showHideButton}
            bottomMargin0
            onClick={handleButtonClick}
          >
            {isPasswordHidden
              ? showButtonLabel
              : hideButtonLabel
            }
          </Button>
        )
        : null}
    </div>
  );
};

ShowHidePasswordField.propTypes = propTypes;
ShowHidePasswordField.defaultProps = defaultProps;

export default ShowHidePasswordField;
