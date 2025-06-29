import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import { applyMiddleware,compose } from 'redux';
import {legacy_createStore as createstore} from "redux"
import {thunk} from "redux-thunk"
import { GoogleOAuthProvider } from '@react-oauth/google';
import Reducers from './Reducers';
const store=createstore(Reducers,compose(applyMiddleware(thunk)));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Provider store={store}>
    <GoogleOAuthProvider clientId="793009494857-fmtld76kghbdklfjqctqdrmme7cskcro.apps.googleusercontent.com">
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </GoogleOAuthProvider>
  </Provider>
);

reportWebVitals();
