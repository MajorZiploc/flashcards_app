const CARDS_LOADED = 'FlashCardsState/CARDS_LOADED';
const SET_IS_DEFINITION_FIRST = 'FlashCardsState/SET_IS_DEFINITION_FIRST';

export function cardsLoaded(cards) {
  return {
    type: CARDS_LOADED,
    cards,
  };
}

export function setIsDefinitionFirst(isDefinitionFirst) {
  return {
    type: SET_IS_DEFINITION_FIRST,
    isDefinitionFirst,
  };
}

export function loadCards(cards) {
  // Do cards loading here
  return (dispatch, getState) => {
    dispatch(cardsLoaded(cards));
  };
}

export function isDefinitionFirstSet(isDefinitionFirst) {
  return (dispatch, getState) => {
    dispatch(setIsDefinitionFirst(isDefinitionFirst));
  };
}

// Similar pattern for calling apis can be used
export const loadCardsAsync = cards => dispatch => {
  return new Promise(resolve => {
    setTimeout(() => {
      dispatch(loadCards(cards));
      resolve();
    }, 1000); // Simulating an async operation with a setTimeout
  });
};

const defaultState = {
  cards: [],
  isLoading: false,
  isDefinitionFirst: false,
};

export default function FlashcardsStateReducer(state = defaultState, action) {
  switch (action.type) {
    case CARDS_LOADED:
      return Object.assign({}, state, {
        isLoading: true,
        cards: action.cards,
      });
    case SET_IS_DEFINITION_FIRST:
      return Object.assign({}, state, {
        isDefinitionFirst: action.isDefinitionFirst,
      });
    default:
      return state;
  }
}
