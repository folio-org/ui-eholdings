import { render } from '@folio/jest-config-stripes/testing-library/react';

import TagsLabel from './tags-label';

const testTags = ['first', 'second', 'third'];

describe('Given TagsLabel', () => {
  it('should render TagsLabel', () => {
    const { getByText } = render(<TagsLabel tagList={testTags} />);

    expect(getByText('ui-eholdings.label.tags')).toBeDefined();
  });
});
