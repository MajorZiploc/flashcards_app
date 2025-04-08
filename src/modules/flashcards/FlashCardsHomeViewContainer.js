import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { deckListSet, loadCards, loadCardsAsync } from './FlashCardsState';

import FlashCardsHomeScreen from './FlashCardsHomeView';

export default compose(
  connect(
    state => ({
      decks: state.flashcards.decks,
    }),
    dispatch => ({
      loadCards: (cards) => dispatch(loadCards(cards)),
      loadCardsAsync: (cards) => loadCardsAsync(cards)(dispatch),
      deckListSet: (decks) => dispatch(deckListSet(decks)),
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  FlashCardsHomeScreen,
);
