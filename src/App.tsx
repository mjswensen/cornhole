import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Host from './host/Host';
import Side from './side/Side';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="App">
        <Route exact path="/" component={Host} />
        <Route path="/player/:offer" component={Side} />
      </div>
    </HashRouter>
  );
};

export default App;
