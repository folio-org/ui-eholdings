import { Component } from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
  NoValue,
  Row,
  Col,
} from '@folio/stripes/components';

import styles from './custom-labels-show-section.css';

export default class CustomLabelsShowSection extends Component {
  static propTypes = {
    customLabels: PropTypes.arrayOf(PropTypes.shape({
      attributes: PropTypes.shape({
        displayLabel: PropTypes.string,
        id: PropTypes.number,
      }),
    })).isRequired,
    userDefinedFields: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  render() {
    const {
      customLabels,
      userDefinedFields,
    } = this.props;

    return (
      <Row className={styles['custom-labels-show-section']}>
        {customLabels.map(({ attributes }) => {
          const {
            displayLabel,
            id,
          } = attributes;
          const value = userDefinedFields[`userDefinedField${id}`];

          return (
            <Col
              md={6}
              sm={12}
              xs={12}
              key={id}
            >
              <KeyValue
                data-test-eholdings-resource-custom-label
                label={displayLabel}
                value={value || <NoValue />}
              />
            </Col>
          );
        })}
      </Row>
    );
  }
}
