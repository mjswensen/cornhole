import React from 'react';
import {
  State,
  currentScore,
  annotatedEphemeralVolley,
  annotatedVolleys,
} from '../common/state';
import ColorIndicator from '../common/ColorIndicator';

const Scoreboard: React.FC<{
  state: State;
}> = ({ state }) => {
  const score = currentScore(state);
  const inProgressVolley = annotatedEphemeralVolley(state);
  const previousVolleys = annotatedVolleys(state.volleys)
    .slice()
    .reverse();
  function diff(diff: number, bust: boolean): React.ReactNode | null {
    if (diff > 0) {
      return (
        <span className={bust ? 'text-danger' : 'text-success'}>
          (+{diff}
          {bust ? ' BUST' : ''})
        </span>
      );
    } else {
      return null;
    }
  }
  return (
    <section className="container">
      <div className="jumbotron">
        <h1 className="display-4">
          Scoreboard
          <span className="ml-3" role="img" aria-label="corn and hole emoji">
            🌽🕳
          </span>
        </h1>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>
              {state.names.side1.teamA} / {state.names.side2.teamA}
              <ColorIndicator color={state.colors.teamA} className="ml-1" />
            </th>
            <th>
              {state.names.side1.teamB} and {state.names.side2.teamB}
              <ColorIndicator color={state.colors.teamB} className="ml-1" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-primary">
            <td>Current Score</td>
            <td className="display-4">{score.teamA}</td>
            <td className="display-4">{score.teamB}</td>
          </tr>
          {inProgressVolley !== null ? (
            <tr className="table-secondary">
              <td>Potential Score</td>
              <td>
                <div>
                  {inProgressVolley.score.teamA}
                  {diff(
                    inProgressVolley.diffA,
                    inProgressVolley.bust === 'teamA',
                  )}
                </div>
                <span className="text-muted font-italic">
                  {state.names[inProgressVolley.throwingSide].teamA} has{' '}
                  {inProgressVolley.teamA.onBoard} on the board and{' '}
                  {inProgressVolley.teamA.inHole} in the hole
                </span>
              </td>
              <td>
                <div>
                  {inProgressVolley.score.teamB}
                  {diff(
                    inProgressVolley.diffB,
                    inProgressVolley.bust === 'teamB',
                  )}
                </div>
                <span className="text-muted font-italic">
                  {state.names[inProgressVolley.throwingSide].teamB} has{' '}
                  {inProgressVolley.teamB.onBoard} on the board and{' '}
                  {inProgressVolley.teamB.inHole} in the hole
                </span>
              </td>
            </tr>
          ) : null}
          {previousVolleys.map((volley, i) => (
            <tr key={i}>
              <td></td>
              <td>
                <div>
                  {state.names[volley.throwingSide].teamA} got{' '}
                  {volley.teamA.onBoard} on the board and {volley.teamA.inHole}{' '}
                  in the hole
                </div>
                {diff(volley.diffA, volley.bust === 'teamA')}
              </td>
              <td>
                <div>
                  {state.names[volley.throwingSide].teamB} got{' '}
                  {volley.teamB.onBoard} on the board and {volley.teamB.inHole}{' '}
                  in the hole
                </div>
                {diff(volley.diffB, volley.bust === 'teamB')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Scoreboard;
