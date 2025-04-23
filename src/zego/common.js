import { Image, View } from 'react-native';

import * as ZIM from 'zego-zim-react-native';

import ZegoUIKitPrebuiltCallService, {
  ZegoInvitationType,
  ZegoMenuBarButtonName,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { ZegoLayoutMode } from '@zegocloud/zego-uikit-rn';

import KeyCenter from '../../KeyCenter';
import { AppGraph, MainGraph, OrderGraph } from '../layouts/graphs';

const notificationStyle = 'CustomView';

export const onUserLoginZego = async (userID, userName, navigation) => {
  console.log('onUserLoginZego')
  try {
    await ZegoUIKitPrebuiltCallService.init(
      KeyCenter.appID,
      KeyCenter.appSign,
      userID,
      userName,
      [ZIM],
      {
        ringtoneConfig: {
          incomingCallFileName: 'ring.mp3',
          outgoingCallFileName: 'zego_outgoing.mp3',
        },
        avatarBuilder: ({ userInfo }) => {
          return (
            <View style={{ width: '100%', height: '100%' }}>
              <Image
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                source={{ uri: `https://robohash.org/${userInfo.userId}.png` }}
              />
            </View>
          );
        },
        waitingPageConfig: {},
        requireInviterConfig: {
          enabled: false,
          detectSeconds: 5,
        },
        showDeclineButton: true,
        innerText: {},
        onIncomingCallDeclineButtonPressed: navigation => {
          console.log('[onIncomingCallDeclineButtonPressed]');
        },
        onIncomingCallAcceptButtonPressed: navigation => {
          console.log('[onIncomingCallAcceptButtonPressed]');
        },
        onOutgoingCallCancelButtonPressed: (
          navigation,
          callID,
          invitees,
          type,
        ) => {
          console.log(
            '[onOutgoingCallCancelButtonPressed]+++',
            navigation,
            callID,
            invitees,
            type,
          );
        },
        onIncomingCallReceived: (
          callID,
          inviter,
          type,
          invitees,
          customData,
        ) => {
          console.log(
            '[Incoming call]+++',
            callID,
            inviter,
            type,
            invitees,
            customData,
          );
        },
        onIncomingCallCanceled: (callID, inviter) => {
          console.log('[onIncomingCallCanceled]+++', callID, inviter);
        },
        onIncomingCallTimeout: (callID, inviter) => {
          console.log('[onIncomingCallTimeout]+++', callID, inviter);
        },
        onOutgoingCallAccepted: (callID, invitee) => {
          console.log('[onOutgoingCallAccepted]+++', callID, invitee);
        },
        onOutgoingCallRejectedCauseBusy: (callID, invitee) => {
          console.log('[onOutgoingCallRejectedCauseBusy]+++', callID, invitee);
        },
        onOutgoingCallDeclined: (callID, invitee) => {
          console.log('[onOutgoingCallDeclined]+++', callID, invitee);
        },
        onOutgoingCallTimeout: (callID, invitees) => {
          console.log('[onOutgoingCallTimeout]+++', callID, invitees);
        },
        requireConfig: callInvitationData => {
          console.log('requireConfig, callID: ', callInvitationData.callID);
          return {
            turnOnMicrophoneWhenJoining: true,
            turnOnCameraWhenJoining:
              callInvitationData.type === ZegoInvitationType.videoCall
                ? true
                : false,
            layout: {
              mode:
                Array.isArray(callInvitationData.invitees) &&
                  callInvitationData.invitees.length > 1
                  ? ZegoLayoutMode.gallery
                  : ZegoLayoutMode.pictureInPicture,
            },
            onCallEnd: (callID, reason, duration) => {
              console.log(
                '########CallWithInvitation onCallEnd',
                callID,
                reason,
                duration,
              );

               ZegoUIKitPrebuiltCallService.hangUp();

               navigation.navigate(OrderGraph.OrderHistoryScreen)
             // navigation.navigate(MainGraph.HomeStackScreen)
              //navigation.goBack()
            },

            timingConfig: {
              isDurationVisible: true,
              onDurationUpdate: duration => {
                console.log(
                  '########CallWithInvitation onDurationUpdate',
                  duration,
                );
                if (duration === 10 * 60) {
                  ZegoUIKitPrebuiltCallService.hangUp();
                }
              },
            },

            topMenuBarConfig: {
              buttons: [
                ZegoMenuBarButtonName.minimizingButton,
                // ZegoMenuBarButtonName.showMemberListButton
              ],
            },

            bottomMenuBarConfig: {
              buttons: [
                // ZegoMenuBarButtonName.toggleCameraButton,
                // ZegoMenuBarButtonName.toggleMicrophoneButton,
                ZegoMenuBarButtonName.hangUpButton, // Đây là nút tắt cuộc gọi
              ],
            },

            onWindowMinimized: () => {
              console.log('[Demo]CallInvitation onWindowMinimized');
              navigation.navigate(OrderGraph.OrderHistoryScreen);
            },

            onWindowMaximized: () => {
              console.log('[Demo]CallInvitation onWindowMaximized');
              navigation.navigate('ZegoUIKitPrebuiltCallInCallScreen');
            },
          };
        },
      },
    );

    if (notificationStyle === 'CallStyle') {
      ZegoUIKitPrebuiltCallService.requestSystemAlertWindow({
        message:
          'We need your consent for the following permissions in order to use the offline call function properly',
        allow: 'Allow',
        deny: 'Deny',
      });
    }

  } catch (error) {
    console.error('Error initializing Zego SDK:', error);
  }
};
