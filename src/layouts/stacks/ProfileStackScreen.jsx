import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import AddressScreen from '../../screens/address/AddressScreen';
import NewAddressScreen from '../../screens/address/NewAddressScreen';
import SearchAddressScreen from '../../screens/address/SearchAddressScreen';
import SelectAddressScreen from '../../screens/address/SelectAddressScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import ProfileScreen from '../../screens/bottom-navs/ProfileScreen';
import OrderDetailScreen from '../../screens/order/OrderDetailScreen';
import OrderHistoryScreen from '../../screens/order/OrderHistoryScreen';
import RatingOrderScreen from '../../screens/order/RatingOrderScreen';
import ChatScreen from '../../screens/shopping/ChatScreen';
import ContactScreen from '../../screens/user-profile/ContactScreen';
import SettingScreen from '../../screens/user-profile/SettingScreen';
import UpdateProfileScreen from '../../screens/user-profile/UpdateProfileScreen';
import {
  AuthGraph,
  BottomGraph,
  MainGraph,
  OrderGraph,
  ShoppingGraph,
  UserGraph,
} from '../graphs';
import { Notifications } from 'react-native-notifications';
import { useNavigation } from '@react-navigation/native';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {

  const navigation = useNavigation(); 
  useEffect(() => {
    // Đăng ký thông báo remote (push) nếu có
    Notifications.registerRemoteNotifications();

    // Đăng ký sự kiện khi người dùng mở thông báo và ứng dụng được mở
    Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        console.log('Thông báo đã được mở:', notification);
        // Điều hướng tới màn hình ChatScreen khi nhấn vào thông báo
        navigation.navigate('ChatScreen');  // Chuyển hướng đến ChatScreen
        completion();
      }
    );

    // Đăng ký sự kiện khi thông báo đến khi app đang hoạt động
    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        console.log('Thông báo nhận được khi app đang hoạt động:', notification);
        completion({ alert: true, sound: true, badge: false });
      }
    );
  }, [navigation]);  // Đảm bảo navigation luôn được cập nhật


  return (
    <ProfileStack.Navigator
      name={MainGraph.ProfileStackScreen}
      screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name={BottomGraph.ProfileScreen}
        component={ProfileScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.UpdateProfileScreen}
        component={UpdateProfileScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.AddressScreen}
        component={AddressScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.ContactScreen}
        component={ContactScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.SettingScreen}
        component={SettingScreen}
      />

      <ProfileStack.Screen
        name={UserGraph.NewAddressScreen}
        component={NewAddressScreen}
      />
      <ProfileStack.Screen
        name={UserGraph.SearchAddressScreen}
        component={SearchAddressScreen}
      />
      <ProfileStack.Screen
        name={UserGraph.SelectAddressScreen}
        component={SelectAddressScreen}
      />
      <ProfileStack.Screen
        name={OrderGraph.RatingOrderScreen}
        component={RatingOrderScreen}
      />
      <ProfileStack.Screen
        name={OrderGraph.OrderHistoryScreen}
        component={OrderHistoryScreen}
      />
      <ProfileStack.Screen
        name={ShoppingGraph.ChatScreen}
        component={ChatScreen}
      />

      <ProfileStack.Screen
        name={OrderGraph.OrderDetailScreen}
        component={OrderDetailScreen}
      />

    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
