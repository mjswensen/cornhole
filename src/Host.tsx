import React, { useState } from 'react';
import QRLink from './QRLink';
import debug from './debug';

const ICE_GATHERING_TIMEOUT = 2000;

const Host: React.FC = () => {
  const [offerUrl, setOfferUrl] = useState<string>();

  async function init() {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stunserver.org'] }],
    });
    debug(pc);

    pc.createDataChannel('testing');

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
    ]).then(() => {
      const { localDescription: description } = pc;
      setOfferUrl(
        `${window.location.href}player/${btoa(JSON.stringify(description))}`,
      );
    });
  }

  return (
    <section>
      <p>Host</p>
      <button onClick={init}>Start new game!</button>
      {offerUrl && <QRLink url={offerUrl} />}
    </section>
  );
};

export default Host;
