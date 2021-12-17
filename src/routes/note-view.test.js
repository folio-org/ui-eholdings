import { MemoryRouter } from 'react-router-dom';
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import NoteViewRoute from './note-view';
import Harness from '../../test/jest/helpers/harness';

jest.mock('@folio/stripes/smart-components', () => ({
  NoteViewPage:
    ({
      navigateBack,
      onEdit,
    }) => (
      <>
        <button
          type="button"
          onClick={navigateBack}
        >
          navigate back
        </button>

        <button
          type="button"
          onClick={onEdit}
        >
          onEdit
        </button>
      </>
    )
}));

const history = {
  goBack: jest.fn(),
  push: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '?searchType=notes&q=test&offset=1',
  hash: '',
};

const match = {
  params: {
    noteId: 'noteId',
  },
};

const getNoteViewRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <NoteViewRoute
        history={history}
        location={location}
        match={match}
        {...props}
      />
        Page content
    </Harness>
  </MemoryRouter>
);

const renderNoteViewRoute = (props) => render(getNoteViewRoute(props));

describe('Given NoteViewRoute', () => {
  beforeEach(() => {
    history.goBack.mockClear();
    history.push.mockClear();
  });

  afterEach(cleanup);

  it('should render NoteViewRoute', async () => {
    const { getByText } = renderNoteViewRoute();

    expect(getByText('Page content')).toBeDefined();
  });

  describe('when click on navigate back button', () => {
    it('should redirect to eholdings page', () => {
      const { getByRole } = renderNoteViewRoute();

      fireEvent.click(getByRole('button', { name: 'navigate back' }));

      expect(history.push).toHaveBeenCalled();
    });
  });

  describe('when click on Edit button', () => {
    it('should redirect to the edit title page', () => {
      const { getByRole } = renderNoteViewRoute();

      fireEvent.click(getByRole('button', { name: 'onEdit' }));

      expect(history.push).toHaveBeenCalled();
    });
  });
});
