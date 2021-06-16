import { Form } from 'react-final-form';
import { render } from '@testing-library/react';

import PublicationTypeField from './publication-type-field';

import { publicationTypes } from '../../../../constants';

describe('Given PublicationTypeField', () => {
  const renderPublicationTypeField = () => render(
    <Form
      onSubmit={() => {}}
      render={() => <PublicationTypeField />}
    />
  );

  it('should render peer reviewed field', () => {
    const { getByText } = renderPublicationTypeField();

    expect(getByText('ui-eholdings.title.publicationType')).toBeDefined();
  });

  it('should display options', () => {
    const { getByText } = renderPublicationTypeField();

    Object.values(publicationTypes).forEach(publicationType => {
      expect(getByText(`ui-eholdings.filter.pubType.${publicationType}`)).toBeDefined();
    });
  });
});
