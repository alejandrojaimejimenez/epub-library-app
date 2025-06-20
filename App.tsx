import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LibraryProvider } from './src/context/LibraryContext';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <LibraryProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </LibraryProvider>
  );
};

export default App;