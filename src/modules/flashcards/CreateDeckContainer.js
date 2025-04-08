import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { isDefinitionFirstSet, deckListSet } from './FlashCardsState';
import CreateDeck from './CreateDeck';

export default compose(
  connect(
    state => ({
      isDefinitionFirst: state.flashcards.isDefinitionFirst,
    }),
    dispatch => ({
      isDefinitionFirstSet: (isDefinitionFirst) => dispatch(isDefinitionFirstSet(isDefinitionFirst)),
      deckListSet: (decks) => dispatch(deckListSet(decks)),
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  CreateDeck,
);
