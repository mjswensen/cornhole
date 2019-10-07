import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { CombinedState } from '../common/state/combined';
import { useSideConnection } from '../common/useConnection';
import Controller from './Controller';
import Setup from './Setup';

const Side: React.FC<RouteComponentProps<{ offer: string }>> = ({
  match: {
    params: { offer: encodedOffer },
  },
}) => {
  const [pc, channel, connected] = useSideConnection();
  const [state, setState] = useState<CombinedState | null>(null);

  useEffect(() => {
    function handleMessage(evt: MessageEvent) {
      setState(JSON.parse(evt.data));
    }
    if (channel) {
      channel.addEventListener('message', handleMessage);
      return () => {
        channel.removeEventListener('message', handleMessage);
      };
    }
  }, [channel]);

  if (!!state) {
    return <Controller state={state} />;
  } else {
    return <Setup pc={pc} encodedOffer={encodedOffer} connected={connected} />;
  }
};

export default Side;
