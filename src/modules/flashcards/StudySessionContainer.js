import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { loadCards, loadCardsAsync } from './FlashCardsState';

import StudySession from './StudySession';

export default compose(
  connect(
    state => ({
      cards: state.flashcards.cards,
      isDefinitionFirst: state.flashcards.isDefinitionFirst,
    }),
    dispatch => ({
      loadCards: (cards) => dispatch(loadCards(cards)),
      loadCardsAsync: (cards) => loadCardsAsync(cards)(dispatch),
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  StudySession,
);
