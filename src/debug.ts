export default (pc: RTCPeerConnection) => {
  pc.addEventListener('connectionstatechange', (...args) => {
    console.log('connectionstatechange', ...args);
  });
  pc.addEventListener('datachannel', (...args) => {
    console.log('datachannel', ...args);
  });
  pc.addEventListener('icecandidate', (...args) => {
    console.log('icecandidate', ...args);
  });
  pc.addEventListener('icecandidateerror', (...args) => {
    console.log('icecandidateerror', ...args);
  });
  pc.addEventListener('iceconnectionstatechange', (...args) => {
    console.log('iceconnectionstatechange', ...args);
  });
  pc.addEventListener('icegatheringstatechange', (...args) => {
    console.log('icegatheringstatechange', ...args);
    console.log('...here is the gathering state', pc.iceGatheringState);
  });
  pc.addEventListener('negotiationneeded', (...args) => {
    console.log('negotiationneeded', ...args);
  });
  pc.addEventListener('signalingstatechange', (...args) => {
    console.log('signalingstatechange', ...args);
    console.log('...here is the signal state', pc.signalingState);
  });
  pc.addEventListener('statsended', (...args) => {
    console.log('statsended', ...args);
  });
  pc.addEventListener('track', (...args) => {
    console.log('track', ...args);
  });
};
