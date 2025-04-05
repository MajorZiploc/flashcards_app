import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import app from '../modules/AppState';
import flashcards from '../modules/flashcards/FlashCardsState';
import decks from '../modules/flashcards/DecksState';

export default combineReducers({
  // ## Generator Reducers
  app,
  flashcards,
});
