import React from 'react';
import OfferLink from './OfferLink';

const Connection: React.FC<{
  pc1: RTCPeerConnection;
  offerUrl1: string;
  connected1: boolean;
  pc2: RTCPeerConnection;
  offerUrl2: string;
  connected2: boolean;
}> = ({ pc1, offerUrl1, connected1, pc2, offerUrl2, connected2 }) => {
  return <div />;
};

export default Connection;
