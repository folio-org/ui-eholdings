import React, { Component } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Headline,
  RepeatableField,
  Select,
  TextField,
  Col,
  Row,
} from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';

export default class IdentifiersFields extends Component {
  validateId(value) {
    let errors;

    if (!value) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.identifiers.noBlank" />;
    }

    if (value && value.length >= 20) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.identifiers.exceedsLength" />;
    }

    return errors;
  }

  renderField = (identifier) => {
    return (
      <Row>
        <Col
          md
          xs={12}
          data-test-eholdings-identifiers-fields-type
        >
          <Field
            name={`${identifier}.flattenedType`}
            type="text"
            component={Select}
            autoFocus={Object.keys(identifier).length === 0}
            label={<FormattedMessage id="ui-eholdings.type" />}
          >
            <FormattedMessage id="ui-eholdings.label.identifier.issnOnline">
              {(message) => <option value="0">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.identifier.issnPrint">
              {(message) => <option value="1">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.identifier.isbnOnline">
              {(message) => <option value="2">{message}</option>}
            </FormattedMessage>
            <FormattedMessage id="ui-eholdings.label.identifier.isbnPrint">
              {(message) => <option value="3">{message}</option>}
            </FormattedMessage>
          </Field>
        </Col>
        <Col
          md
          xs={12}
          data-test-eholdings-identifiers-fields-id
        >
          <FormattedMessage id="ui-eholdings.id">
            {(fieldName) => (
              <Field
                name={`${identifier}.id`}
                type="text"
                component={TextField}
                label={fieldName}
                validate={this.validateId}
                ariaLabel={fieldName}
              />
            )}
          </FormattedMessage>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div data-test-eholdings-identifiers-fields>
        <FieldArray name="identifiers">
          {({ fields, meta: { initial } }) => (
            <RepeatableField
              addLabel={<FormattedMessage id="ui-eholdings.title.identifier.addIdentifier" />}
              emptyMessage={
                initial && initial.length > 0 && initial[0].id ?
                  <FormattedMessage id="ui-eholdings.title.identifier.notSet" /> : ''
              }
              fields={fields}
              legend={
                <Headline tag="h4">
                  <FormattedMessage id="ui-eholdings.label.identifiers" />
                </Headline>
              }
              onAdd={() => fields.push({})}
              onRemove={index => fields.remove(index)}
              renderField={this.renderField}
            />
          )}
        </FieldArray>
      </div>
    );
  }
}
