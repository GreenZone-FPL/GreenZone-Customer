import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import RegisterScreen from './src/screens/bottom-navs/RegisterScreen';
import RegisterScreenLinear from './src/screens/bottom-navs/RegisterScreenLinear';
AppRegistry.registerComponent(appName, () => RegisterScreen);
