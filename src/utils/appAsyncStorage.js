import AsyncStorage from '@react-native-async-storage/async-storage';

export class AppAsyncStorage {
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
            await AsyncStorage.clear();
            console.log('All data cleared');
        } catch (error) {
            console.log('Error clearing all data:', error);
        }
    }
}


