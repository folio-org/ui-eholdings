import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  IconButton
} from '@folio/stripes-components';
import css from './RepeatableField.css';

export default class RepeatableField extends Component {
  static propTypes = {
    addLabel: PropTypes.string,
    fields: PropTypes.object.isRequired,
    legend: PropTypes.string,
    emptyMessage: PropTypes.string,
    renderField: PropTypes.func.isRequired
  };

  render() {
    const {
      addLabel,
      fields,
      legend,
      emptyMessage,
      renderField
    } = this.props;

    return (
      <fieldset data-test-repeatable-field className={css.repeatableField}>
        {legend && (
          <legend className={css.repeatableFieldLegend}>
            {legend}
          </legend>
        )}

        {fields.length === 0 && emptyMessage && (
          <p data-test-repeatable-field-empty-message>
            {emptyMessage}
          </p>
        )}

        {fields.length > 0 && (
          <ul className={css.repeatableFieldList}>
            {fields.map((field, index) => (
              <li
                className={css.repeatableFieldItem}
                key={index}
              >
                {renderField(field, index, fields)}
                <div
                  className={css.repeatableFieldRemoveItem}
                >
                  <IconButton
                    data-test-repeatable-field-remove-item-button
                    icon="trashBin"
                    onClick={() => fields.remove(index)}
                    size="small"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        <Button
          data-test-repeatable-field-add-item-button
          onClick={() => fields.push({})}
          type="button"
        >
          {addLabel}
        </Button>
      </fieldset>
    );
  }
}
