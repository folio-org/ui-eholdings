import { MemoryRouter } from "react-router-dom";
import { render, cleanup, act, fireEvent } from '@testing-library/react';

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
          navigateBack
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
    await act(async () => {
      await renderNoteViewRoute();
    });
  });

  describe('when when click on navigateBack button', () => {
    it('should navigate back', () => {
      const { getByRole } = renderNoteViewRoute();

      fireEvent.click(getByRole('button', { name: 'navigateBack' }));

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
