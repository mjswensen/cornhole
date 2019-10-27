import React, { useState } from 'react';
import QRLink from './QRLink';
import { decode } from '../common/answer';

const OfferLink: React.FC<{
  pc: RTCPeerConnection;
  offerUrl: string;
  title: string;
}> = ({ pc, offerUrl, title }) => {
  const [value, setValue] = useState('');
  const [erred, setErred] = useState(false);
  return (
    <div className="rounded border border-gray-7 bg-gray-1">
      <QRLink url={offerUrl} />
      <div className="p-3">
        <h2 className="text-xl">{title}</h2>
        <p className="mt-2">Paste response code here:</p>
        <textarea
          className="bg-gray-0 mt-2 border border-gray-7 rounded w-full"
          value={value}
          onChange={evt => {
            const { value } = evt.target;
            setErred(false);
            setValue(value);
            try {
              const answer = decode(value);
              pc.setRemoteDescription(answer as RTCSessionDescription);
            } catch {
              setErred(true);
            }
          }}
        ></textarea>
        {erred ? (
          <div className="mt-2 border border-danger-foreground rounded bg-danger-background text-danger-foreground p-1">
            Something didn't look right with that code. Please try again.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OfferLink;
