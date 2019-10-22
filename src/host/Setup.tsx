import React, { useState } from 'react';
import Button from '../common/Button';
import {
  Side,
  State,
  Action,
  setTeamColor,
  setPlayerName,
} from '../common/state';
import ColorPicker from './ColorPicker';
import Input from './Input';
import OfferLink from './OfferLink';

async function init(
  pc: RTCPeerConnection,
): Promise<RTCSessionDescription | null> {
  const ICE_GATHERING_TIMEOUT = 2000;

  const iceGatheringComplete = new Promise(resolve => {
    pc.addEventListener('icegatheringstatechange', () => {
      if (pc.iceGatheringState === 'complete') {
        resolve();
      }
    });
  });

  const iceGatheringTimeout = new Promise(resolve => {
    setTimeout(() => resolve(), ICE_GATHERING_TIMEOUT);
  });

  const signalingStatusComplete = new Promise(resolve => {
    pc.addEventListener('signalingstatechange', () => {
      if (pc.signalingState === 'have-local-offer') {
        resolve();
      }
    });
  });

  pc.createOffer().then(offer => {
    pc.setLocalDescription(offer);
  });

  await Promise.all([
    Promise.race([iceGatheringComplete, iceGatheringTimeout]),
    signalingStatusComplete,
  ]);

  return pc.localDescription;
}

function descriptionUrl(
  side: Side,
  channel: RTCDataChannel,
  description: RTCSessionDescription | null,
): string {
  return `${window.location.origin}/#/player/${side}/${channel.id}/${btoa(
    JSON.stringify(description),
  )}`;
}

const Setup: React.FC<{
  pc1: RTCPeerConnection;
  pc2: RTCPeerConnection;
  channel1: RTCDataChannel;
  channel2: RTCDataChannel;
  connected1: boolean;
  connected2: boolean;
  state: State;
  dispatch: React.Dispatch<Action>;
}> = ({
  pc1,
  pc2,
  channel1,
  channel2,
  connected1,
  connected2,
  state,
  dispatch,
}) => {
  const [initializing, setInitializing] = useState(false);
  const [offerUrl1, setOfferUrl1] = useState<string>();
  const [offerUrl2, setOfferUrl2] = useState<string>();

  const initialized = !!offerUrl1 && !!offerUrl2;
  if (!initialized) {
    return (
      <section className="flex items-center justify-center min-h-full">
        <form className="max-w-3xl p-4">
          <h1 className="font-display text-6xl text-center mb-4">Cornhole</h1>
          <table className="table-fixed border-collapse w-full">
            <thead>
              <tr className="border-b-2 border-gray-1">
                <th className="w-1/5 text-left text-lg py-1 px-2">
                  Team Color
                </th>
                <th className="w-2/5 text-left text-lg py-1 px-2">Side 1</th>
                <th className="w-2/5 text-left text-lg py-1 px-2">Side 2</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-1">
                <td className="p-1">
                  <ColorPicker
                    value={state.colors.teamA}
                    onChange={color => dispatch(setTeamColor('teamA', color))}
                  />
                </td>
                <td className="p-1">
                  <Input
                    placeholder="Player name..."
                    value={state.names.side1.teamA}
                    onChange={evt =>
                      dispatch(setPlayerName('side1', 'teamA', evt))
                    }
                  />
                </td>
                <td className="p-1">
                  <Input
                    placeholder="Player name..."
                    value={state.names.side2.teamA}
                    onChange={evt =>
                      dispatch(setPlayerName('side2', 'teamA', evt))
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="p-1">
                  <ColorPicker
                    value={state.colors.teamB}
                    onChange={color => dispatch(setTeamColor('teamB', color))}
                  />
                </td>
                <td className="p-1">
                  <Input
                    placeholder="Player name..."
                    value={state.names.side1.teamB}
                    onChange={evt =>
                      dispatch(setPlayerName('side1', 'teamB', evt))
                    }
                  />
                </td>
                <td className="p-1">
                  <Input
                    placeholder="Player name..."
                    value={state.names.side2.teamB}
                    onChange={evt =>
                      dispatch(setPlayerName('side2', 'teamB', evt))
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-center mt-4">
            <Button
              disabled={initializing}
              onClick={() => {
                init(pc1).then(desc =>
                  setOfferUrl1(descriptionUrl('side1', channel1, desc)),
                );
                init(pc2).then(desc =>
                  setOfferUrl2(descriptionUrl('side2', channel2, desc)),
                );
                setInitializing(true);
              }}
            >
              Start game
            </Button>
          </div>
        </form>
      </section>
    );
  } else {
    return (
      <section className="h-100 d-flex flex-column justify-content-center">
        <div className="d-flex justify-content-between">
          {offerUrl1 &&
            (connected1 ? (
              <div className="w-25 p-3">
                <div className="alert alert-success">
                  <h4 className="alert-heading">Side 1 connected!</h4>
                  <hr />
                  <p className="mb-0">
                    {state.names.side1.teamA} and {state.names.side1.teamB} are
                    ready.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-25 p-3">
                <OfferLink pc={pc1} offerUrl={offerUrl1} title="Side 1" />
              </div>
            ))}
          {offerUrl2 &&
            (connected2 ? (
              <div className="w-25 p-3">
                <div className="alert alert-success">
                  <h4 className="alert-heading">Side 2 connected!</h4>
                  <hr />
                  <p className="mb-0">
                    {state.names.side2.teamA} and {state.names.side2.teamB} are
                    ready.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-25 p-3">
                <OfferLink pc={pc2} offerUrl={offerUrl2} title="Side 2" />
              </div>
            ))}
        </div>
      </section>
    );
  }
};

export default Setup;
