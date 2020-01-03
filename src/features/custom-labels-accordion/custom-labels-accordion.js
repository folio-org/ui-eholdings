import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Accordion, Headline } from '@folio/stripes/components';

import Toaster from '../../components/toaster';
import CustomLabelsSection from '../../components/custom-labels-section';
import { getCustomLabels as getCustomLabelsAction } from '../../redux/actions';
import selectCustomLabels from '../../redux/selectors/select-custom-labels';

class CustomLabelsAccordion extends Component {
  static propTypes = {
    customLabels: PropTypes.object.isRequired,
    getCustomLabels: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    userDefinedFields: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { getCustomLabels } = this.props;

    getCustomLabels();
  }

  getToastErrors() {
    const { customLabels: { errors } } = this.props;

    return errors.map((error) => {
      return {
        message: error.title,
        type: 'error',
      };
    });
  }

  getCustomLabelsAccordionHeader = () => {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id="ui-eholdings.resource.customLabels" />
      </Headline>
    );
  }

  render() {
    const {
      customLabels: { items: { data = [] } },
      isOpen,
      id,
      onToggle,
      userDefinedFields,
    } = this.props;

    return (
      <Fragment>
        <Accordion
          id={id}
          open={isOpen}
          label={this.getCustomLabelsAccordionHeader()}
          onToggle={onToggle}
        >
          <CustomLabelsSection
            customLabels={data}
            userDefinedFields={userDefinedFields}
          />
        </Accordion>

        <Toaster
          position="bottom"
          toasts={this.getToastErrors()}
        />
      </Fragment>
    );
  }
}

export default connect(
  (store) => ({
    customLabels: selectCustomLabels(store),
  }), {
    getCustomLabels: getCustomLabelsAction,
  }
)(CustomLabelsAccordion);
