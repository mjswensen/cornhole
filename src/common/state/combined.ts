import { TurnState } from './turn';
import { ScoreState } from './score';

export type CombinedState = {
  turnState: TurnState;
  scoreState: ScoreState;
  identity: 'side1' | 'side2';
};
