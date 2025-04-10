import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

export class AppAsyncStorage {
  static STORAGE_KEYS = {
    CART: 'CART',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    userId: 'userI',
    user: 'user',
    activeOrders: 'activeOrders',
    currentLocation: 'currentLocation',
    merchantLocation: 'merchantLocation',
    awaitingPayments: 'awaitingPayments',
  };

  static async readData(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.log('Error reading data:', error);
      return defaultValue;
    }
  }

  static async storeData(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.log('Error storing data:', error);
    }
  }

  static async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('Error removing data:', error);
    }
  }

  static async clearAll() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('Trước khi xóa, có các key:', allKeys);

      await AsyncStorage.clear();

      const remainingKeys = await AsyncStorage.getAllKeys();
      console.log('Sau khi xóa, còn lại key:', remainingKeys);
    } catch (error) {
      console.log('Error clearing all data:', error);
    }
  }

  static async isTokenValid() {
    const accessToken = await AppAsyncStorage.readData(
      AppAsyncStorage.STORAGE_KEYS.accessToken,
    );
    if (!accessToken) {
      return false;
    }

    try {
      const decoded = jwtDecode(accessToken); // Sử dụng jwt_decode thay vì jwtDecode
      // console.log('decoded', decoded);
      const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (tính theo giây)

      return decoded.exp > currentTime; // Nếu exp lớn hơn currentTime thì token còn hạn
    } catch (error) {
      console.log('Lỗi khi decode token:', error);
      return false; // Token không hợp lệ
    }
  }

  static async addToActiveOrders(order) {
    try {
      const orderId = order.orderId;
      if (!orderId) {
        console.log('Không tìm thấy orderId, không thể lưu!');
        return;
      }

      let activeOrders = await this.readData(
        this.STORAGE_KEYS.activeOrders,
        [],
      );

      const index = activeOrders.findIndex(o => o.orderId === orderId);
      if (index !== -1) {
        activeOrders[index] = order;
      } else {
        activeOrders.push(order);
      }

      await this.storeData(this.STORAGE_KEYS.activeOrders, activeOrders);
    } catch (error) {
      console.log('Lỗi khi lưu order:', error);
    }
  }

  static async getActiveOrders() {
    const activeOrders = await this.readData(
      this.STORAGE_KEYS.activeOrders,
      [],
    );
    return activeOrders;
  }

  static async removeFromActiveOrder(orderId) {
    try {
      let activeOrders = await this.readData(
        this.STORAGE_KEYS.activeOrders,
        [],
      );
      activeOrders = activeOrders.filter(o => o.orderId !== orderId);
      await this.storeData(this.STORAGE_KEYS.activeOrders, activeOrders);
    } catch (error) {
      console.log('Lỗi khi xóa order:', error);
    }
  }
}
