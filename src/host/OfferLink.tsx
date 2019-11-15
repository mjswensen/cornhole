import React, { useState } from 'react';
import { decode } from '../common/answer';
import QrReader from 'react-qr-reader';
import Button from '../common/Button';
import QR from '../common/QR';

const OfferLink: React.FC<{
  pc: RTCPeerConnection;
  offerUrl: string;
  title: string;
}> = ({ pc, offerUrl, title }) => {
  const [erred, setErred] = useState(false);
  const [scanning, setScanning] = useState(false);
  return (
    <div className="rounded border border-gray-7 bg-gray-1">
      {scanning ? (
        <QrReader
          delay={300}
          onError={() => {
            setErred(true);
          }}
          onScan={(data: unknown) => {
            if (typeof data === 'string') {
              setErred(false);
              try {
                const answer = decode(data);
                pc.setRemoteDescription(answer as RTCSessionDescription);
              } catch {
                setErred(true);
              }
            }
          }}
          style={{ width: '100%' }}
        />
      ) : (
        <a href={offerUrl} target="_blank" rel="noopener noreferrer">
          <QR className="rounded-t" data={offerUrl} alt="Join game" />
        </a>
      )}
      <div className="p-3">
        <h2 className="text-xl">{title}</h2>
        {erred ? (
          <div className="mt-2 border border-danger-foreground rounded bg-danger-background text-danger-foreground p-1">
            <span className="mr-1" role="img" aria-label="crying face">
              😢
            </span>
            Something didn't look right with that code. Please try again.
          </div>
        ) : null}
        {scanning ? (
          <Button
            className="mt-2"
            secondary
            onClick={() => {
              setScanning(false);
            }}
          >
            Cancel
          </Button>
        ) : (
          <Button
            className="mt-2"
            onClick={() => {
              setScanning(true);
            }}
          >
            Scan response
          </Button>
        )}
      </div>
    </div>
  );
};

export default OfferLink;
