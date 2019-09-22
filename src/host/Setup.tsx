import React, { useState } from 'react';
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

function descriptionUrl(description: RTCSessionDescription | null): string {
  return `${window.location.origin}/#/player/${btoa(
    JSON.stringify(description),
  )}`;
}

const Setup: React.FC<{
  pc1: RTCPeerConnection;
  pc2: RTCPeerConnection;
  connected1: boolean;
  connected2: boolean;
}> = ({ pc1, pc2, connected1, connected2 }) => {
  const [initialized, setInitialized] = useState(false);
  const [offerUrl1, setOfferUrl1] = useState<string>();
  const [offerUrl2, setOfferUrl2] = useState<string>();

  if (!initialized) {
    return (
      <section>
        <p>Host</p>
        <button
          onClick={() => {
            init(pc1).then(desc => setOfferUrl1(descriptionUrl(desc)));
            init(pc2).then(desc => setOfferUrl2(descriptionUrl(desc)));
            setInitialized(true);
          }}
        >
          Start new game!
        </button>
      </section>
    );
  } else {
    return (
      <section>
        {offerUrl1 &&
          (connected1 ? (
            'Side 1 connected!'
          ) : (
            <OfferLink pc={pc1} offerUrl={offerUrl1} title="Side 1" />
          ))}
        {offerUrl2 &&
          (connected2 ? (
            'Side 2 connected!'
          ) : (
            <OfferLink pc={pc2} offerUrl={offerUrl2} title="Side 2" />
          ))}
      </section>
    );
  }
};

export default Setup;
