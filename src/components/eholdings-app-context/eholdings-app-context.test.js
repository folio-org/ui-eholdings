import { MemoryRouter } from 'react-router-dom';
import {
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import EHoldingsAppContext from './eholdings-app-context';

const renderEHoldingsAppContext = () => render(
  <MemoryRouter>
    <EHoldingsAppContext />
  </MemoryRouter>
);

describe('Given Eholdings App Context', () => {
  describe('when click on page name', () => {
    it('should render context eholdings app link', () => {
      const { getByText } = renderEHoldingsAppContext();

      expect(getByText('ui-eholdings.navigation.app')).toBeDefined();
    });

    it('should render submit a KB content inquiry link', () => {
      const { getByText } = renderEHoldingsAppContext();

      expect(getByText('ui-eholdings.navigation.content')).toBeDefined();
    });

    it('should render EBSCO system status link', () => {
      const { getByText } = renderEHoldingsAppContext();

      expect(getByText('ui-eholdings.navigation.systemStatus')).toBeDefined();
    });

    it('should render keyboard shortcuts menu button', () => {
      const { getByText } = renderEHoldingsAppContext();

      expect(getByText('ui-eholdings.navigation.keyboardShortcuts')).toBeDefined();
    });
    /*
    describe('when clicking on keyboard shortcuts button', () => {
      it('should show shortcuts modal', () => {
        const { getByText } = renderEHoldingsAppContext();

        fireEvent.click(getByText('ui-eholdings.navigation.keyboardShortcuts'));

        expect(getByText('stripes-components.shortcut.modalLabel')).toBeDefined();
      });
    });
    */
  });
});
