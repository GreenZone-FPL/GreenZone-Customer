import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import SearchProductScreen from './src/screens/shopping/SearchProductScreen';
AppRegistry.registerComponent(appName, () => SearchProductScreen);
