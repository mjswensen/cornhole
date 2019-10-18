import React from 'react';
import {
  State,
  currentScore,
  annotatedEphemeralFrame,
  annotatedFrames,
} from '../common/state';
import ColorIndicator from '../common/ColorIndicator';

const Scoreboard: React.FC<{
  state: State;
}> = ({ state }) => {
  const score = currentScore(state);
  const inProgressFrame = annotatedEphemeralFrame(state);
  const previousFrames = annotatedFrames(state.frames)
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
          {inProgressFrame !== null ? (
            <tr className="table-secondary">
              <td>Potential Score</td>
              <td>
                <div>
                  {inProgressFrame.score.teamA}
                  {diff(
                    inProgressFrame.diffA,
                    inProgressFrame.bust === 'teamA',
                  )}
                </div>
                <span className="text-muted font-italic">
                  {state.names[inProgressFrame.throwingSide].teamA} has{' '}
                  {inProgressFrame.teamA.onBoard} on the board and{' '}
                  {inProgressFrame.teamA.inHole} in the hole
                </span>
              </td>
              <td>
                <div>
                  {inProgressFrame.score.teamB}
                  {diff(
                    inProgressFrame.diffB,
                    inProgressFrame.bust === 'teamB',
                  )}
                </div>
                <span className="text-muted font-italic">
                  {state.names[inProgressFrame.throwingSide].teamB} has{' '}
                  {inProgressFrame.teamB.onBoard} on the board and{' '}
                  {inProgressFrame.teamB.inHole} in the hole
                </span>
              </td>
            </tr>
          ) : null}
          {previousFrames.map((frame, i) => (
            <tr key={i}>
              <td></td>
              <td>
                <div>
                  {state.names[frame.throwingSide].teamA} got{' '}
                  {frame.teamA.onBoard} on the board and {frame.teamA.inHole} in
                  the hole
                </div>
                {diff(frame.diffA, frame.bust === 'teamA')}
              </td>
              <td>
                <div>
                  {state.names[frame.throwingSide].teamB} got{' '}
                  {frame.teamB.onBoard} on the board and {frame.teamB.inHole} in
                  the hole
                </div>
                {diff(frame.diffB, frame.bust === 'teamB')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Scoreboard;
