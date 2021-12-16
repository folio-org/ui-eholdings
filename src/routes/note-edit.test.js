import { MemoryRouter } from "react-router-dom";
import { render, cleanup, act, fireEvent } from '@testing-library/react';

import NoteEditRoute from './note-edit';
import Harness from '../../test/jest/helpers/harness';

jest.mock('@folio/stripes/smart-components', () => ({
    NoteEditPage:
        ({
            navigateBack,
        }) => (
            <>
                <button
                    type="button"
                    onClick={navigateBack}
                >
                    navigateBack
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
        await act(async () => {
            await renderNoteEditRoute();
        });
    });

    describe('when navigateBack click', () => {
        it('should navigateBack', () => {
            const { getByRole } = renderNoteEditRoute();

            fireEvent.click(getByRole('button', { name: 'navigateBack' }));

            expect(history.goBack).toHaveBeenCalled();
        });
    });
});
