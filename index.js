import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import AgoraVoiceCall from './src/agora/AgoraVoiceCall'

AppRegistry.registerComponent(appName, () => App);

