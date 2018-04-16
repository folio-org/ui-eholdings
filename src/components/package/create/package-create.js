import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import { Button, PaneHeader } from '@folio/stripes-components';

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
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired
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
      request,
      handleSubmit,
      onSubmit,
      pristine
    } = this.props;

    return (
      <div>
        <Toaster
          position="bottom"
          toasts={request.errors.map(({ title }, index) => ({
            id: `error-${request.timestamp}-${index}`,
            message: title,
            type: 'error'
          }))}
        />

        <PaneHeader paneTitle="New custom package" />

        <div className={styles['package-create-form-container']}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DetailsViewSection label="Package information" separator={false}>
              <NameField />
              <ContentTypeField />
            </DetailsViewSection>
            <DetailsViewSection label="Coverage dates">
              <CoverageFields />
            </DetailsViewSection>
            <div className={styles['package-create-action-buttons']}>
              <div data-test-eholdings-package-create-cancel-button>
                <Button type="button" onClick={this.handleCancel}>
                  Cancel
                </Button>
              </div>
              <div data-test-eholdings-package-create-save-button>
                <Button type="submit" buttonStyle="primary">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>

        <NavigationModal when={!pristine && !request.isPending} />
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
  destroyOnUnmount: false
})(PackageCreate);
