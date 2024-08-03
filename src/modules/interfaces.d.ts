export type useState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export interface DBCard {
  id: any;
  term: string;
  definition: string;
  deckId: any;
}

export interface StudyCard extends DBCard {
  front: string;
  back: string;
}

export interface DBDeck {
  id: any;
  name: string;
}
