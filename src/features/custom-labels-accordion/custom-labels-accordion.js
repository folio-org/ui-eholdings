import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Accordion,
  Headline,
} from '@folio/stripes/components';

import Toaster from '../../components/toaster';
import { getCustomLabels as getCustomLabelsAction } from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';

class CustomLabelsAccordion extends Component {
  static propTypes = {
    customLabels: PropTypes.shape({
      errors: PropTypes.array,
      items: PropTypes.shape({
        data: PropTypes.array,
      }),
    }).isRequired,
    getCustomLabels: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
    section: PropTypes.node.isRequired,
    userDefinedFields: PropTypes.objectOf(PropTypes.string).isRequired,
  }

  static defaultProps = {
    isOpen: true,
  }

  componentDidMount() {
    const { getCustomLabels } = this.props;

    getCustomLabels();
  }

  getToastErrors() {
    const { customLabels: { errors } } = this.props;

    return errors.map((error) => ({
      message: error.title,
      type: 'error',
    }));
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
      customLabels,
      id,
      isOpen,
      onToggle,
      section: Section,
      userDefinedFields,
    } = this.props;

    const data = get(customLabels, ['items', 'data'], []);

    return (
      <>
        {data.length &&
          <Accordion
            id={id}
            label={this.getCustomLabelsAccordionHeader()}
            open={isOpen}
            onToggle={onToggle}
          >
            <Section
              customLabels={data}
              userDefinedFields={userDefinedFields}
            />
          </Accordion>}

        <Toaster
          position="bottom"
          toasts={this.getToastErrors()}
        />
      </>
    );
  }
}

export default connect(
  (store) => ({
    customLabels: selectPropFromData(store, 'customLabels'),
  }), {
    getCustomLabels: getCustomLabelsAction,
  }
)(CustomLabelsAccordion);
