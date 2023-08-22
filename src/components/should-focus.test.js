import { render } from '@folio/jest-config-stripes/testing-library/react';

import shouldFocus from './should-focus';

describe('Given shouldFocus', () => {
  const MockComponent = () => (
    <a href="test-href">Test link</a>
  );

  const MockShouldFocus = shouldFocus(MockComponent);

  const renderShouldFocus = ({ isFocus, ...props }) => render(
    <MockShouldFocus
      shouldFocus={isFocus}
      {...props}
    />
  );

  it('should render focused component', () => {
    const { getByRole } = renderShouldFocus({ shouldFocus: true });

    const renderedLink = getByRole('link', { name: 'Test link' });

    expect(renderedLink).toBeDefined();
    expect(renderedLink).toHaveFocus();
  });

  it('should render not focused component', () => {
    const { getByRole } = renderShouldFocus({ shouldFocus: false });

    const renderedLink = getByRole('link', { name: 'Test link' });

    expect(renderedLink).toBeDefined();
    expect(renderedLink).not.toHaveFocus();
  });

  it('should set focus on component after updating props ', () => {
    const {
      getByRole,
      rerender
    } = render(<MockShouldFocus shouldFocus={false} />);

    const renderedLink = getByRole('link', { name: 'Test link' });

    expect(renderedLink).toBeDefined();
    expect(renderedLink).not.toHaveFocus();

    rerender(<MockShouldFocus shouldFocus />);

    expect(renderedLink).toHaveFocus();
  });
});
