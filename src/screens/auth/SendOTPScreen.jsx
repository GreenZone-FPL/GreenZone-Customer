import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { sendOTPAPI } from '../../axios';
import {AuthGraph} from '../../layouts/graphs/authGraph'
import { colors } from '../../constants';

const SendOTPScreen = (props) => {
    const {navigation} = props
    const [phoneNumber, setPhoneNumber] = useState('0868441273');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (phoneNumber.trim().length !== 10 || !/^[0-9]+$/.test(phoneNumber)) {
            Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
            return;
        }

        setLoading(true);
        try {
            const response = await sendOTPAPI({ phoneNumber});
            if (response) {
                console.log('otp = ', response.code)
                // Alert.alert('Thành công', `Mã OTP: ${response.code}`);
                navigation.navigate(AuthGraph.VerifyOTPScreen, {phoneNumber})
            } else {
                Alert.alert('Lỗi', 'Không thể gửi OTP, vui lòng thử lại sau.');
            }
        } catch (error) {
            console.log('error', error)
          
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xác Thực OTP</Text>

            <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Gửi OTP</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: colors.fbBg, gap: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.black },
    input: {
        width: '100%',
        height: 50,
        borderColor: colors.gray200,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.white,
        fontSize: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    button: { backgroundColor: colors.primary, padding: 16, borderRadius: 10, width: '80%' },
    buttonText: { color: colors.white, fontSize: 16, textAlign: 'center' },
    buttonDisabled: {
        backgroundColor: '#95a5a6',
    }
});

export default SendOTPScreen;
