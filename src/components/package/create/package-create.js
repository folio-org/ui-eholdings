import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
// import isEqual from 'lodash/isEqual';

import {
  Button,
  PaneHeader,
  TextField
} from '@folio/stripes-components';

// import DetailsView from '../../details-view';
import DetailsViewSection from '../../details-view-section';
import NameField, { validate as validatePackageName } from '../_fields/name';
import CoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import styles from './package-create.css';

class PackageCreate extends Component {
  static propTypes = {
    request: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    // pristine: PropTypes.bool
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        goBack: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  handleCancel = () => {
    this.context.router.history.goBack();
  }

  render() {
    let {
      handleSubmit,
      onSubmit
    } = this.props;

    return (
      <div>
        <PaneHeader
          paneTitle="New custom package"
        />
        <div className={styles['package-create-form-container']}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DetailsViewSection
              label="Package information"
            >
              <NameField />
              <ContentTypeField />
            </DetailsViewSection>
            <DetailsViewSection
              label="Coverage dates"
            >
              <CoverageFields />
            </DetailsViewSection>
            <div className={styles['package-create-action-buttons']}>
              <div
                data-test-eholdings-package-create-cancel-button
              >
                <Button
                  type="button"
                  onClick={this.handleCancel}
                >
                  Cancel
                </Button>
              </div>
              <div
                data-test-eholdings-package-create-save-button
              >
                <Button
                  type="submit"
                  buttonStyle="primary"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const validate = (values, props) => {
  return Object.assign({}, validatePackageName(values), validateCoverageDates(values, props));
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'PackageCreate',
  destroyOnUnmount: false,
})(PackageCreate);
