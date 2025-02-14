import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { OtpInput } from "react-native-otp-entry";

const OTPExample = () => {
    const [otp, setOtp] = useState('');

   
    const handleOtpSubmit = () => {
        console.log(`OTP entered: ${otp}`);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Enter OTP</Text>
            <OtpInput numberOfDigits={6} onTextChange={(text) => console.log(text)} />
            <Text onPress={handleOtpSubmit} style={{ marginTop: 20 }}>
                Submit OTP
            </Text>
        </View>
    );
};

export default OTPExample;
