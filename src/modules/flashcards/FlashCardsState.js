const CARDS_LOADED = 'FlashCardsState/CARDS_LOADED';
const SET_IS_DEFINITION_FIRST = 'FlashCardsState/SET_IS_DEFINITION_FIRST';
const SET_IS_SHUFFLED = 'FlashCardsState/SET_IS_SHUFFLED';

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

export function setIsShuffled(isShuffled) {
  return {
    type: SET_IS_SHUFFLED,
    isShuffled,
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

export function isShuffledSet(isShuffled) {
  return (dispatch, getState) => {
    dispatch(setIsShuffled(isShuffled));
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
  isShuffled: false,
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
    case SET_IS_SHUFFLED:
      return Object.assign({}, state, {
        isShuffled: action.isShuffled,
      });
    default:
      return state;
  }
}
