const CARDS_LOADED = 'FlashCardsState/CARDS_LOADED';

export function cardsLoaded(cards) {
  return {
    type: CARDS_LOADED,
    cards,
  };
}

export function loadCards(cards) {
  // Do cards loading here
  return (dispatch, getState) => {
    dispatch(cardsLoaded(cards));
  };
}

const defaultState = {
  cards: [],
  isLoading: false,
};

export default function FlashcardsStateReducer(state = defaultState, action) {
  switch (action.type) {
    case CARDS_LOADED:
      return Object.assign({}, state, {
        isLoading: true,
        cards: action.cards,
      });
    default:
      return state;
  }
}
