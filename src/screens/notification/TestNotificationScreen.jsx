import React, { useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { Notifications } from 'react-native-notifications';

const TestNotificationScreen = () => {

  useEffect(() => {
    Notifications.registerRemoteNotifications();

    // Định nghĩa category với các action button
    Notifications.setCategories([
      {
        identifier: 'SOME_CATEGORY',
        actions: [
          {
            identifier: 'REPLY_ACTION',
            title: 'Trả lời',
            options: { foreground: true },
          },
          {
            identifier: 'DISMISS_ACTION',
            title: 'Bỏ qua',
            options: { destructive: true },
          },
        ],
      },
    ]);

    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        console.log('Thông báo nhận được khi app đang hoạt động:', notification);
        completion({ alert: true, sound: true, badge: false });
      }
    );

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log('Thông báo đã được mở:', notification);
      completion();
    });

    Notifications.events().registerNotificationReceivedBackground((action) => {
      console.log('Hành động được chọn:', action.identifier);
      if (action.identifier === 'REPLY_ACTION') {
        console.log('Người dùng chọn Trả lời');
      } else if (action.identifier === 'DISMISS_ACTION') {
        console.log('Người dùng chọn Bỏ qua');
      }
    });
  }, []);


  const sendNotification = () => {
    Notifications.postLocalNotification({
      body: "Bạn có muốn trả lời hoặc bỏ qua?",
      title: "Thông báo có hành động",
      sound: "chime.aiff",
      category: "SOME_CATEGORY", // Phải trùng với category đã đăng ký
      userInfo: {},
      fireDate: new Date(),
    });
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ứng dụng gửi thông báo khi nhấn nút</Text>
      <Button title="Gửi thông báo" onPress={sendNotification} />
    </View>
  );
};

export default TestNotificationScreen;
