import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import { verifyOTP } from '../../axios';
import { colors } from '../../constants';
import { AppGraph, AuthGraph } from '../../layouts/graphs';
import { Toaster } from '../../utils/toaster';
import { Ani_ModalLoading } from '../../components';
import { useAppContext, ActionTypes } from '../../context/AppContext';

const VerifyOTPScreen = ({ route, navigation }) => {
    const {dispatch} = useAppContext()
    const { phoneNumber } = route.params;
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);



    const handleVerifyOTP = async () => {
        if (code.length !== 6) {
            Toaster.show("Vui lòng nhập mã OTP gồm 6 chữ số.")
            return;
        }

        setLoading(true)
        try {
            const response = await verifyOTP({ phoneNumber, code });

         
            const userLastName = response.user.lastName
            console.log("✅ OTP Verified, userLastName = ", response.user.lastName);
            if (userLastName) {
                Toaster.show("Đăng nhập thành công!")
                dispatch({type: ActionTypes.LOGIN})

            } else {
                dispatch({type: ActionTypes.REGISTER})
                navigation.navigate(AuthGraph.RegisterScreen)
            }

        } catch (error) {
            Toaster.show(`Error: ${error}`)
            console.log("Error", error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <View style={styles.container}>
            <Ani_ModalLoading loading={loading} message='Đang xác thực...' />
            <Text style={styles.title}>Xác thực OTP</Text>
            <Text style={styles.subtitle}>Nhập mã OTP gửi đến {phoneNumber}</Text>

            <OtpInput
                focusColor={colors.primary}
                autoFocus={true}
                secureTextEntry={false}
                numberOfDigits={6}
                onTextChange={setCode} />

            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: colors.fbBg, gap: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.black },
    subtitle: { fontSize: 14, color: colors.gray850 },
    button: { backgroundColor: colors.primary, padding: 16, borderRadius: 10, width: '80%' },
    buttonText: { color: colors.white, fontSize: 16, textAlign: 'center' },
});

export default VerifyOTPScreen;

