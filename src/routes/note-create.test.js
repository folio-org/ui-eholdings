import { MemoryRouter } from 'react-router-dom';
import {
  render,
  cleanup,
} from '@testing-library/react';

import NoteCreateRoute from './note-create';
import Harness from '../../test/jest/helpers/harness';

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const history = {
  goBack: jest.fn(),
};

const getNoteCreateRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <NoteCreateRoute
        history={history}
        location={location}
        {...props}
      />
      Page content
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
    const { getByText } = renderNoteCreateRoute();

    expect(getByText('Page content')).toBeDefined();
  });
});
