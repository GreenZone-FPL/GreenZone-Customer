import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { sendOTPApi } from '../../axios/modules/auth';
import {AuthGraph} from '../../layouts/graphs/authGraph'

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
            const response = await sendOTPApi({ phoneNumber});
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    button: {
        backgroundColor: '#27ae60',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        shadowColor: '#27ae60',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#95a5a6',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SendOTPScreen;
