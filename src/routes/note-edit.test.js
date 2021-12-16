import { MemoryRouter } from "react-router-dom";
import { 
  render, 
  cleanup,
  fireEvent, 
} from '@testing-library/react';

import NoteEditRoute from './note-edit';
import Harness from '../../test/jest/helpers/harness';

jest.mock('@folio/stripes/smart-components', () => ({
    NoteEditPage:
        ({ navigateBack }) => (
            <>
                <button
                    type="button"
                    onClick={navigateBack}
                >
                    navigate back
                </button>
            </>
        )
}));

const history = {
    goBack: jest.fn(),
};

const location = {
    pathname: 'pathname',
    search: '',
    hash: '',
};

const match = {
    params: {
        id: 'id',
    },
};

const getNoteEditRoute = (props = {}) => (
    <MemoryRouter>
        <Harness>
            <NoteEditRoute
                history={history}
                location={location}
                match={match}
                {...props}
            />
                Page content
        </Harness>
    </MemoryRouter>
);

const renderNoteEditRoute = (props) => render(getNoteEditRoute(props));

describe('Given NoteEditRoute', () => {
    beforeEach(() => {
        history.goBack.mockClear();
    });

    afterEach(cleanup);

    it('should render NoteEditRoute', async () => {
        const { getByText } = renderNoteEditRoute();
        
        expect(getByText('Page content')).toBeDefined();
    });

    describe('when click on navigate back button', () => {
        it('should handle "history.goBack"', () => {
            const { getByRole } = renderNoteEditRoute();

            fireEvent.click(getByRole('button', { name: 'navigate back' }));

            expect(history.goBack).toHaveBeenCalled();
        });
    });
});
