import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}
