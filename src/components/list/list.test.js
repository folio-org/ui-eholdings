import { render } from '@folio/jest-config-stripes/testing-library/react';

import List from './list';

describe('Given List', () => {
  const renderList = ({ children, ...props }) => render(
    <List {...props}>
      {children}
    </List>
  );

  it('should render List', () => {
    const children = (
      <>
        <li>item1</li>
        <li>item2</li>
      </>
    );
    const { getByText } = renderList({ children });

    expect(getByText('item1')).toBeDefined();
    expect(getByText('item2')).toBeDefined();
  });
});
