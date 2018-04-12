import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEqual from 'lodash/isEqual';

import {
  IconButton,
  KeyValue
} from '@folio/stripes-components';

import PackageContentTypeField from '../package-content-type-field';
import InlineForm from '../inline-form';
import styles from './package-content-type.css';

const cx = classNames.bind(styles);

class PackageContentType extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      contentType: PropTypes.string
    }).isRequired,
    isEditable: PropTypes.bool,
    onEdit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    isPending: PropTypes.bool,
    handleSubmit: PropTypes.func,
    initialize: PropTypes.func,
    pristine: PropTypes.bool
  };

  state = {
    isEditing: !!this.props.isEditable
  };

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.isPending && !nextProps.isPending;
    let needsUpdate = !isEqual(this.props.initialValues, nextProps.initialValues);

    if (wasPending && needsUpdate) {
      this.toggleEditing(false);
    }
  }

  toggleEditing(isEditing = !this.state.isEditing) {
    if (this.props.onEdit) {
      this.props.onEdit(isEditing);
    } else {
      this.setState({ isEditing });
    }
  }

  handleEdit = (e) => {
    e.preventDefault();
    this.toggleEditing(true);
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.toggleEditing(false);
    this.props.initialize(this.props.initialValues);
  }

  renderEditingForm() {
    let {
      pristine,
      isPending,
      handleSubmit,
      onSubmit
    } = this.props;

    return (
      <InlineForm
        data-test-eholdings-package-content-type-form
        onSubmit={handleSubmit(onSubmit)}
        onCancel={this.handleCancel}
        pristine={pristine}
        isPending={isPending}
      >
        <PackageContentTypeField />
      </InlineForm>
    );
  }

  renderContentType() {
    const {
      contentType
    } = this.props.initialValues;

    return (
      <div className={styles['package-content-type-display']}>
        <KeyValue label="Content type">
          <span data-test-eholdings-package-content-type>
            {contentType}
          </span>
        </KeyValue>
        <div data-test-eholdings-package-content-type-edit-button>
          <IconButton icon="edit" onClick={this.handleEdit} />
        </div>
      </div>
    );
  }

  render() {
    let {
      isEditable = this.state.isEditing
    } = this.props;
    let contents;

    if (isEditable) {
      contents = this.renderEditingForm();
    } else {
      contents = this.renderContentType();
    }

    return (
      <div
        data-test-eholdings-package-content-type
        className={cx(styles['package-content-type'], {
          'is-editing': isEditable
        })}
      >
        {contents}
      </div>
    );
  }
}

export default reduxForm({
  enableReinitialize: true,
  form: 'PackageContentType',
  destroyOnUnmount: false
})(PackageContentType);
