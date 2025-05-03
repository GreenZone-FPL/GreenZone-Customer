import React, { useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import { Text, View } from 'react-native';
import { PrimaryButton } from '../components';

const AgoraVoiceCall = () => {
  const [videoCall, setVideoCall] = useState(false);

  const connectionData = {
    appId: 'fe3c3a3d74d44303a69d5e01e3637cb4',
    channel: 'test',
  };

  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
  };

  return videoCall ? (
    <AgoraUIKit
      connectionData={connectionData}
      rtcCallbacks={rtcCallbacks}
    />
  ) : (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

      <PrimaryButton title='Start Call' onPress={() => setVideoCall(true)} />

    </View>

  );
};

export default AgoraVoiceCall
