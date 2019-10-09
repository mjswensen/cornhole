import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Side as SideState, State } from '../common/state';
import { useConnection } from '../common/useConnection';
import Controller from './Controller';
import Setup from './Setup';

const Side: React.FC<
  RouteComponentProps<{ side: SideState; channelId: string; offer: string }>
> = ({
  match: {
    params: { side, channelId, offer: encodedOffer },
  },
}) => {
  const [pc, channel, connected] = useConnection(+channelId);
  const [state, setState] = useState<State | null>(null);

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

  if (!!state && !!channel) {
    return <Controller side={side} state={state} channel={channel} />;
  } else {
    return <Setup pc={pc} encodedOffer={encodedOffer} connected={connected} />;
  }
};

export default Side;
