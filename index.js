import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import SendOTPScreen from './src/screens/auth/SendOTPScreen';
import MySkeleton from './src/components/category/MySkeleton';

AppRegistry.registerComponent(appName, () => App);
