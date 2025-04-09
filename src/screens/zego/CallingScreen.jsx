import React from 'react';
import { View, StyleSheet } from 'react-native';
import {ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import keyStore from '../../../keyStore';

export default function CallingScreen(props) {
    const { userName, userID, id } = props.route.params.data;

    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                appID={keyStore.appID}
                appSign={keyStore.appSign}
                userID={userID} // userID can be something like a phone number or the user id on your own user system. 
                userName={userName}
                callID={'rn12563213515'} // callID can be any unique string. 

                config={{
                    // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onCallEnd: (callID, reason, duration) => { props.navigation.navigate('ZegoScreen') },
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
  },
});
