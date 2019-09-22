import React from 'react';
import useConnection from '../common/useConnection';
import Setup from './Setup';
import { RouteComponentProps } from 'react-router';

const Side: React.FC<RouteComponentProps<{ offer: string }>> = ({
  match: {
    params: { offer: encodedOffer },
  },
}) => {
  const [pc, channel, connected] = useConnection(true);

  return <Setup pc={pc} encodedOffer={encodedOffer} connected={connected} />;
};

export default Side;
