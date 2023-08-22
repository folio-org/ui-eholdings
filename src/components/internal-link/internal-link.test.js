import { render } from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../test/jest/helpers/harness';

import InternalLink from './internal-link';

const toPathString = '/eholdings/providers/test-id1';
const toPathObject = {
  pathname: '/eholdings/providers/test-id2',
};

describe('Given InternalLink', () => {
  const renderInternalLink = ({ to, ...props }) => render(
    <Harness>
      <InternalLink to={to} {...props}>
        Test link
      </InternalLink>
    </Harness>
  );

  describe('when `to` is typeof string', () => {
    it('should render link', () => {
      const { getByRole } = renderInternalLink({ to: toPathString });

      const linkElement = getByRole('link', { name: 'Test link' });

      expect(linkElement).toBeDefined();
      expect(linkElement).toHaveAttribute('href', '/eholdings/providers/test-id1');
    });
  });

  describe('when `to` is typeof object', () => {
    it('should render link', () => {
      const { getByRole } = renderInternalLink({ to: toPathObject });

      const linkElement = getByRole('link', { name: 'Test link' });

      expect(linkElement).toBeDefined();
      expect(linkElement).toHaveAttribute('href', '/eholdings/providers/test-id2');
    });
  });
});
