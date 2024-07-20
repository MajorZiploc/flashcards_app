import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { loadCards } from './FlashCardsState';

import FlashCardsHomeScreen from './FlashCardsHomeView';

export default compose(
  connect(
    state => ({
      cards: state.flashcards.cards
    }),
    dispatch => ({
      loadCards: (cards) => dispatch(loadCards(cards)),
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  FlashCardsHomeScreen,
);
