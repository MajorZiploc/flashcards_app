import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import app from '../modules/AppState';
import flashcards from '../modules/flashcards/FlashCardsState';

export default combineReducers({
  // ## Generator Reducers
  app,
  flashcards,
});
