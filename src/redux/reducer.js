import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import gallery from '../modules/gallery/GalleryState';
import app from '../modules/AppState';
import flashcards from '../modules/flashcards/FlashCardsState';

export default combineReducers({
  // ## Generator Reducers
  gallery,
  app,
  flashcards,
});
