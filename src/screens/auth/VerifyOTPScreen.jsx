import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { verifyOTPApi } from '../../axios/modules/auth';
import {AppGraph} from '../../layouts/graphs/appGraph'

const VerifyOTPScreen = ({ route, navigation }) => {
    const { phoneNumber } = route.params; // Lấy số điện thoại từ màn hình trước
    const [code, setCode] = useState('');

    const handleVerifyOTP = async () => {
        if (code.length !== 6) {
            Alert.alert("❌ Lỗi", "Vui lòng nhập mã OTP gồm 6 chữ số.");
            return;
        }
        try {
            const response = await verifyOTPApi({ phoneNumber, code });
            if (response.statusCode === 201) {
                Alert.alert("✅ Thành công", "Đăng nhập thành công!");
                // console.log('otp = ', response.code)
                // Lưu token để dùng cho các API tiếp theo (có thể dùng AsyncStorage)
                // AsyncStorage.setItem('authToken', response.token);

                navigation.navigate(AppGraph.MAIN)
            } else {
                Alert.alert("❌ Lỗi", "Mã OTP không hợp lệ.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            Alert.alert("❌ Lỗi", "Xác thực OTP thất bại.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xác thực OTP</Text>
            <Text style={styles.subtitle}>Nhập mã OTP gửi đến {phoneNumber}</Text>

            <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
                placeholder="Nhập OTP"
                value={code}
                onChangeText={setCode}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#2c3e50' },
    subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 20 },
    input: { width: '80%', padding: 15, borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 10, textAlign: 'center', fontSize: 18 },
    button: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, marginTop: 20, width: '80%' },
    buttonText: { color: 'white', fontSize: 18, textAlign: 'center' },
});

export default VerifyOTPScreen;
