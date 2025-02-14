import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import OTPExample from './src/screens/auth/OTPExample';
import VerifyOTPScreen from './src/screens/auth/VerifyOTPScreen';
AppRegistry.registerComponent(appName, () => App);
