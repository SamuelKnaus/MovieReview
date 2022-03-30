import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../redux/Store';

export interface ReduxState {
  appState: AppState
  appStateDispatch: string,
}

export default function withAppState(Child: any, stateSelector: any = null) {
  return function getChild(props: any) {
    let appState;
    if (stateSelector != null) {
      appState = useSelector(stateSelector);
    }
    const dispatch = useDispatch();
    return <Child {...props} appState={appState} appStateDispatch={dispatch} />;
  };
}
