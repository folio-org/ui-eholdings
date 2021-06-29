import { Form } from 'react-final-form';
import { render } from '@testing-library/react';

import PeerReviewedField from './peer-reviewed-field';

describe('Given PeerReviewedField', () => {
  const renderPeerReviewedField = () => render(
    <Form
      onSubmit={() => {}}
      render={() => <PeerReviewedField />}
    />
  );

  it('should render peer reviewed field', () => {
    const { getByText } = renderPeerReviewedField();

    expect(getByText('ui-eholdings.title.peerReviewed')).toBeDefined();
  });
});
