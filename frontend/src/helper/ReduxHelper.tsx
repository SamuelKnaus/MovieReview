import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../redux/Store';

export interface ReduxState {
  appState: AppState
  appStateDispatch: Dispatch,
}

/**
 * Injects the redux app state and the dispatch method into the given child object
 * @param Child The component that needs redux support
 * @param stateSelector a selector to specify what part of the state should be injected.
 *    Per default the entire state is injected.
 * @returns The child as rendered JSX element
 */
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
