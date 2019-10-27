import React from 'react';
import classnames from 'classnames';
import { winner, State } from './state';

const Winner: React.FC<{ state: State; opaque?: boolean }> = ({
  state,
  opaque,
}) => {
  const winningTeam = winner(state);
  return winningTeam ? (
    <>
      <div
        className={classnames(
          'fixed',
          'top-0',
          'right-0',
          'bottom-0',
          'left-0',
          'bg-gray-0',
          opaque ? 'opacity-1' : 'opacity-75',
        )}
      ></div>
      <div className="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center">
        <span className="font-display text-6xl text-center p-5">
          <span className="mr-4" role="img" aria-label="crown">
            👑
          </span>
          {state.names.side1[winningTeam]} / {state.names.side2[winningTeam]}{' '}
          win!
        </span>
      </div>
    </>
  ) : null;
};

export default Winner;
