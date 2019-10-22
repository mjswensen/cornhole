import React from 'react';
import classnames from 'classnames';
import {
  State,
  currentScore,
  annotatedEphemeralFrame,
  annotatedFrames,
} from '../common/state';
import ColorIndicator from '../common/ColorIndicator';
import Diff from './Diff';

const Scoreboard: React.FC<{
  state: State;
}> = ({ state }) => {
  const score = currentScore(state);
  const inProgressFrame = annotatedEphemeralFrame(state);
  const previousFrames = annotatedFrames(state.frames)
    .slice()
    .reverse();
  function textFrame(
    name: string,
    onBoard: number,
    inHole: number,
    verb = 'got',
  ): string {
    const result: string[] = [name, verb];
    if (onBoard > 0) {
      result.push(`${onBoard} on the board`);
    }
    if (onBoard > 0 && inHole > 0) {
      result.push('and');
    }
    if (inHole > 0) {
      result.push(`${inHole} in the hole`);
    }
    if (onBoard === 0 && inHole === 0) {
      result.push('no points');
    }
    return result.join(' ');
  }
  return (
    <section className="w-full max-w-3xl mx-auto h-full flex flex-col p-3">
      <h1 className="font-display text-6xl text-center">Scoreboard</h1>
      <div className="flex flex-col-reverse flex-grow overflow-y-scroll">
        {previousFrames.map((frame, i) => (
          <div
            key={i}
            className="flex justify-between mt-2 pt-2 border-t border-gray-1"
          >
            <span>
              <Diff
                diff={frame.diffA}
                bust={frame.bust === 'teamA'}
                className="mr-1"
              />
              {textFrame(
                state.names[frame.throwingSide].teamA,
                frame.teamA.onBoard,
                frame.teamA.onBoard,
              )}
            </span>
            <span>
              {textFrame(
                state.names[frame.throwingSide].teamB,
                frame.teamB.onBoard,
                frame.teamB.inHole,
              )}
              <Diff
                diff={frame.diffB}
                bust={frame.bust === 'teamB'}
                className="ml-1"
              />
            </span>
          </div>
        ))}
      </div>
      {inProgressFrame !== null ? (
        <div className="flex justify-between mt-2 pt-3 border-t border-gray-2">
          <div>
            <div>
              <Diff
                diff={inProgressFrame.diffA}
                bust={inProgressFrame.bust === 'teamA'}
                className="mr-1"
              />
              {textFrame(
                state.names[inProgressFrame.throwingSide].teamA,
                inProgressFrame.teamA.onBoard,
                inProgressFrame.teamA.inHole,
                'has',
              )}
            </div>
            <div className="flex items-center justify-start text-gray-4">
              <span className="text-xl">{inProgressFrame.score.teamA}</span>
              <span className="ml-2">potential score</span>
            </div>
          </div>
          <div>
            <div>
              {textFrame(
                state.names[inProgressFrame.throwingSide].teamB,
                inProgressFrame.teamB.onBoard,
                inProgressFrame.teamB.inHole,
                'has',
              )}
              <Diff
                diff={inProgressFrame.diffB}
                bust={inProgressFrame.bust === 'teamB'}
                className="ml-1"
              />
            </div>
            <div className="flex items-center justify-end text-gray-4">
              <span className="mr-2">potential score</span>
              <span className="text-xl">{inProgressFrame.score.teamB}</span>
            </div>
          </div>
        </div>
      ) : null}
      <div
        className={classnames(
          'flex',
          'justify-between',
          'text-xl',
          'border-t-2',
          'border-gray-2',
          {
            'mt-2': !inProgressFrame,
            'mt-3': !!inProgressFrame,
          },
        )}
      >
        <div className="flex items-center">
          <span className="text-6xl mr-5">{score.teamA}</span>
          <ColorIndicator color={state.colors.teamA} className="mr-3" />
          {state.names.side1.teamA} / {state.names.side2.teamA}
        </div>
        <div className="flex items-center">
          {state.names.side1.teamB} / {state.names.side2.teamB}
          <ColorIndicator color={state.colors.teamB} className="ml-3" />
          <span className="text-6xl ml-5">{score.teamB}</span>
        </div>
      </div>
    </section>
  );
};

export default Scoreboard;
