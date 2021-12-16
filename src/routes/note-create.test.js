import { MemoryRouter } from "react-router-dom";
import { render, cleanup, act } from '@testing-library/react';

import NoteCreateRoute from './note-create';
import Harness from '../../test/jest/helpers/harness';

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const history = {
  goBack: jest.fn()
};

const getNoteCreateRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <NoteCreateRoute
        history={history.goBack}
        location={location}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderNoteCreateRoute = (props) => render(getNoteCreateRoute(props));

describe('Given NoteCreateRoute', () => {
  beforeEach(() => {
    history.goBack.mockClear();
  });

  afterEach(cleanup);

  it('should render NoteCreateRoute', async () => {
    await act(async () => {
      await renderNoteCreateRoute();
    });
  });
});
