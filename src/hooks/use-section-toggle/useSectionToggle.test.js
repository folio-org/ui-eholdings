import { renderHook, act } from '@testing-library/react-hooks';
import useSectionToggle from './useSectionToggle';

describe('useSectionToggle hook', () => {
  it('should invert section state', () => {
    const initialState = {
      firstAccordion: true,
      secondAccordion: false,
    };

    const { result } = renderHook(() => useSectionToggle(initialState));
    const { handleSectionToggle } = result.current[1];

    act(() => {
      handleSectionToggle({ id: 'firstAccordion' });
    });

    expect(result.current[0]).toMatchObject({
      firstAccordion: false,
      secondAccordion: false,
    });
  });

  it('should set passed state', () => {
    const initialState = {
      firstAccordion: false,
      secondAccordion: false,
      thirdAccordion: true,
    };

    const { result } = renderHook(() => useSectionToggle(initialState));
    const { handleExpandAll } = result.current[1];

    act(() => {
      handleExpandAll({
        firstAccordion: true,
        secondAccordion: true,
        thirdAccordion: true,
      });
    });

    expect(result.current[0]).toMatchObject({
      firstAccordion: true,
      secondAccordion: true,
      thirdAccordion: true,
    });
  });

  it('should set all sections state to expanded', () => {
    const initialState = {
      firstAccordion: false,
      secondAccordion: false,
      thirdAccordion: true,
    };

    const { result } = renderHook(() => useSectionToggle(initialState));
    const { toggleAllSections } = result.current[1];

    act(() => {
      toggleAllSections(true);
    });

    expect(result.current[0]).toMatchObject({
      firstAccordion: true,
      secondAccordion: true,
      thirdAccordion: true,
    });
  });
});
