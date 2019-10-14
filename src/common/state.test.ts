import {
  reducer,
  Action,
  beginVolley,
  updateVolley,
  commitVolley,
  initialState,
  currentScore,
  winner,
} from './state';

it('properly calculates the current score and winner', () => {
  const actions1: Action[] = [
    beginVolley('side1'),
    updateVolley({
      throwingSide: 'side1',
      teamA: { onBoard: 2, inHole: 1 },
      teamB: { onBoard: 3, inHole: 0 },
    }),
    commitVolley(),
    beginVolley('side2'),
    updateVolley({
      throwingSide: 'side2',
      teamA: { onBoard: 4, inHole: 0 },
      teamB: { onBoard: 2, inHole: 2 },
    }),
    commitVolley(),
  ];
  const state1 = actions1.reduce(reducer, initialState);
  const score1 = currentScore(state1);
  expect(score1).toEqual({
    teamA: 2,
    teamB: 4,
  });

  const actions2: Action[] = [
    beginVolley('side1'),
    updateVolley({
      throwingSide: 'side1',
      teamA: { onBoard: 0, inHole: 4 },
      teamB: { onBoard: 0, inHole: 0 },
    }),
    commitVolley(),
    beginVolley('side2'),
    updateVolley({
      throwingSide: 'side2',
      teamA: { onBoard: 0, inHole: 4 },
      teamB: { onBoard: 0, inHole: 0 },
    }),
    commitVolley(),
  ];
  const state2 = actions2.reduce(reducer, state1);
  const score2 = currentScore(state2);
  expect(score2).toEqual({
    teamA: 11,
    teamB: 4,
  });

  const actions3: Action[] = [
    beginVolley('side1'),
    updateVolley({
      throwingSide: 'side1',
      teamA: { onBoard: 1, inHole: 3 },
      teamB: { onBoard: 0, inHole: 0 },
    }),
    commitVolley(),
  ];
  const state3 = actions3.reduce(reducer, state2);
  const score3 = currentScore(state3);
  expect(score3).toEqual({
    teamA: 21,
    teamB: 4,
  });
  expect(winner(state3)).toBe('teamA');
});
