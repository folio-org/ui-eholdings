import { render } from '@folio/jest-config-stripes/testing-library/react';

import NoResultsMessage from './no-results-message';

describe('Given NoResultsMessage', () => {
  const renderNoResultsMessage = (props) => render(<NoResultsMessage {...props} />);

  it('should show NoReslutsMessage', () => {
    const { getByText } = renderNoResultsMessage({ children: 'child content' });

    expect(getByText('child content')).toBeDefined();
  });
});
