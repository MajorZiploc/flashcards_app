const DECKS_LOADED = 'DecksState/DECKS_LOADED';

/**
 * @typedef {import('../interfaces').DBDeck} DBDeck
 */

export function decksLoaded(decks) {
  return {
    type: DECKS_LOADED,
    decks,
  };
}

/** @type {(decks: DBDeck[]) => void} */
export function setDecks(decks) {
  // Do decks loading here
  return (dispatch, getState) => {
    dispatch(decksLoaded(decks));
  };
}

const defaultState = {
  decks: [],
  isLoading: false,
};

export default function DeckStateReducer(state = defaultState, action) {
  switch (action.type) {
    case DECKS_LOADED:
      return Object.assign({}, state, {
        isLoading: true,
        decks: action.decks,
      });
    default:
      return state;
  }
}
