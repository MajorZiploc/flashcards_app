import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { loadCards, loadCardsAsync  } from './FlashCardsState';
import { setDecks } from './DecksState';

import FlashCardsHomeScreen from './FlashCardsHomeView';

export default compose(
  connect(
    state => ({}),
    dispatch => ({
      loadCards: (cards) => dispatch(loadCards(cards)),
      loadCardsAsync: (cards) => loadCardsAsync(cards)(dispatch),
      setDecks: (decks) => dispatch(setDecks(decks)),
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  FlashCardsHomeScreen,
);
