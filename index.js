import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import RegisterScreen from './src/screens/bottom-navs/RegisterScreen';
AppRegistry.registerComponent(appName, () => RegisterScreen);
