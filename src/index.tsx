import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register({
  onUpdate: () => {
    window.alert(
      'A new version of Cornhole is available and has been downloaded in the background. Close and re-open to use the latest version.',
    );
  },
});
