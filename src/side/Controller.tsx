import React from 'react';
import classnames from 'classnames';
import {
  Side,
  State,
  beginFrame,
  updateFrame,
  commitFrame,
  cancelFrame,
  Team,
} from '../common/state';
import Button from '../common/Button';
import ColorIndicator from '../common/ColorIndicator';
import Stepper from './Stepper';

const Controller: React.FC<{
  side: Side;
  state: State;
  channel: RTCDataChannel;
}> = ({ side, state, channel }) => {
  const oppositeSide = side === 'side1' ? 'side2' : 'side1';
  function sendUpdatedFrame(
    team: Team,
    countKey: 'onBoard' | 'inHole',
    value: number,
  ) {
    if (state.ephemeralFrame) {
      channel.send(
        JSON.stringify(
          updateFrame({
            ...state.ephemeralFrame,
            [team]: {
              ...state.ephemeralFrame[team],
              [countKey]: Math.min(Math.max(value, 0), 4),
            },
          }),
        ),
      );
    }
    if (window.navigator.vibrate) {
      window.navigator.vibrate(
        countKey === 'inHole' ? Array(5).fill(200) : [200],
      );
    }
  }
  return (
    <section
      className={classnames(
        'flex',
        'items-center',
        'flex-col',
        'justify-center',
        'min-h-full',
        'max-w-3xl',
        'mx-auto',
        'p-4',
      )}
    >
      <h1 className="font-display text-6xl text-center mb-4">
        Side {side === 'side1' ? '1' : '2'}
      </h1>
      {state.ephemeralFrame === null ? (
        <div className="text-center">
          <Button
            onClick={() => {
              channel.send(JSON.stringify(beginFrame(oppositeSide)));
            }}
          >
            Start recording frame
          </Button>
        </div>
      ) : state.ephemeralFrame.throwingSide === side ? (
        <p className="text-center">Your side is currently throwing.</p>
      ) : (
        <>
          <div className="rounded border border-gray-7 bg-gray-1 p-3 mb-3 w-full">
            <h2 className="text-xl mb-3 flex items-center">
              {state.names[oppositeSide].teamA}
              <ColorIndicator color={state.colors.teamA} className="ml-3" />
            </h2>
            <p className="mb-2">On the board:</p>
            <Stepper
              className="mb-2"
              value={state.ephemeralFrame.teamA.onBoard}
              onChange={v => sendUpdatedFrame('teamA', 'onBoard', v)}
            />
            <p className="mb-2">In the hole:</p>
            <Stepper
              className="mb-2"
              value={state.ephemeralFrame.teamA.inHole}
              onChange={v => sendUpdatedFrame('teamA', 'inHole', v)}
            />
          </div>
          <div className="rounded border border-gray-7 bg-gray-1 p-3 mb-3 w-full">
            <h2 className="text-xl mb-3 flex items-center">
              {state.names[oppositeSide].teamB}
              <ColorIndicator color={state.colors.teamB} className="ml-3" />
            </h2>
            <p className="mb-2">On the board:</p>
            <Stepper
              className="mb-2"
              value={state.ephemeralFrame.teamB.onBoard}
              onChange={v => sendUpdatedFrame('teamB', 'onBoard', v)}
            />
            <p className="mb-2">In the hole:</p>
            <Stepper
              className="mb-2"
              value={state.ephemeralFrame.teamB.inHole}
              onChange={v => sendUpdatedFrame('teamB', 'inHole', v)}
            />
          </div>
          <div>
            <Button
              className="mr-3"
              secondary
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to cancel recording this frame?',
                  )
                ) {
                  channel.send(JSON.stringify(cancelFrame()));
                }
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => channel.send(JSON.stringify(commitFrame()))}>
              Complete Frame
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default Controller;
