export type useState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export interface DBCard {
  id: any;
  term: string;
  definition: string;
  deckId: any;
}

export interface StudyCard {
  id: any;
  term: string;
  definition: string;
  front: string;
  back: string;
  deckId: any;
}

export interface DBDeck {
  id: any;
  name: string;
}
