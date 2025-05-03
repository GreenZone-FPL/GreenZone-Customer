import React, { useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import { Text, View, StyleSheet } from 'react-native';
import { Column, NormalHeader, PrimaryButton } from '../components';
import { colors } from '../constants';
import { useNavigation } from '@react-navigation/native';

const AgoraVoiceCall = () => {
  const [videoCall, setVideoCall] = useState(false);
  const navigation = useNavigation()
  const connectionData = {
    appId: 'fe3c3a3d74d44303a69d5e01e3637cb4',
    channel: 'GreenZone',
  };

  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
  };

  return videoCall ? (
    <AgoraUIKit
      videoCall={false}
      connectionData={connectionData}
      rtcCallbacks={rtcCallbacks}
    />
  ) : (
    <Column

      style={styles.container}
    >
      <NormalHeader title='Agora Call' onLeftPress={() => navigation.goBack()} />

      <PrimaryButton
        title='Start Call'

        style={styles.button}
        onPress={() => setVideoCall(true)}
      />

    </Column>

  );
};

export default AgoraVoiceCall
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'column',

  },
  button: {
    width: 200,
    padding: 14,
    alignSelf: 'center'
  }
})
