import React from 'react';
import {
  HashRouter as Router
} from 'react-router-dom';
import { Routes } from '~/routes';
import { SiteLayout } from '~/common/mui/SiteLayout'

function App() {
  return (
    <SiteLayout>
      <Router>
        <Routes />
      </Router>
    </SiteLayout>
  );
}

export default App;
