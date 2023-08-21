import { Form } from 'react-final-form';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import AccessTypeField from './access-type-field';

const renderAccessTypeField = ({ accessStatusTypes }) => render(
  <Form
    onSubmit={() => {}}
    render={() => <AccessTypeField accessStatusTypes={accessStatusTypes} />}
  />
);

describe('Given AccessTypeField', () => {
  let accessStatusTypes;

  describe('when access status types presented', () => {
    beforeEach(() => {
      accessStatusTypes = [{
        id: 'id1',
        name: 'name1',
      }];
    });

    it('should show AccessTypeField', () => {
      const { getByText } = renderAccessTypeField({ accessStatusTypes });

      expect(getByText('ui-eholdings.settings.accessStatusTypes.type')).toBeDefined();
    });
  });
});
