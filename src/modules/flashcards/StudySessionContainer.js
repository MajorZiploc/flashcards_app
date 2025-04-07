import { connect } from 'react-redux';
import { compose, withState } from 'recompose';

import StudySession from './StudySession';

export default compose(
  connect(
    state => ({
      cards: state.flashcards.cards,
      isDefinitionFirst: state.flashcards.isDefinitionFirst,
      isShuffled: state.flashcards.isShuffled,
    }),
  ),
  withState('isExtended', 'setIsExtended', false))(
  StudySession,
);
