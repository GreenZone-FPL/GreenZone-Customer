import React, { useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { Notifications } from 'react-native-notifications';

const TestNotificationScreen = () => {

  // Đăng ký thông báo khi app khởi động
  useEffect(() => {
    // Đăng ký thông báo remote (push) nếu có
    Notifications.registerRemoteNotifications();

    // Đăng ký sự kiện khi thông báo đến khi app đang hoạt động
    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        console.log('Thông báo nhận được khi app đang hoạt động:', notification);
        completion({ alert: true, sound: true, badge: false });
      }
    );

    // Đăng ký sự kiện khi người dùng mở thông báo
    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log('Thông báo đã được mở:', notification);
      completion();
    });
  }, []);

  // Hàm để gửi thông báo
  const sendNotification = () => {
    Notifications.postLocalNotification({
      title: 'Thông báo từ App!',
      body: 'Bạn vừa nhấn vào nút gửi thông báo.',
      extra: 'Dữ liệu thêm',  // Dữ liệu tùy chọn
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
