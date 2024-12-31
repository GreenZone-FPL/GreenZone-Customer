
import { StyleSheet, Text, View, TextInput, Pressable, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../../screens/auth/LoginScreen'
import colors from '../../constants/color'

const CustomInputPassword = (props) => {
    const { placeholder, value, setValue, message, visiblePassword, setVisiblePassword } = props
    const togglePassword = () => {
        setVisiblePassword(!visiblePassword)
    }
    return (
        <View style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',

        }}>
            <View style={styles.containerPassword}>
                <TextInput
                    placeholderTextColor={colors.gray}
                    placeholder={placeholder}
                    secureTextEntry={!visiblePassword}
                    value={value}
                    onChangeText={setValue}
                    style={[styles.inputPassword, { fontWeight: value ? 'bold' : '300' }]}
                >
                </TextInput>
                <Pressable style={styles.btnTogglePassword} onPress={togglePassword}>
                    <Image
                        style={styles.visible}
                        source={visiblePassword ? require('../images/visible_off.png') : require('../images/visible.png')} />
                </Pressable>

            </View>
            <Text style={[styles.invalidText, { color: message ? colors.invalid : colors.primary }]}>{message}</Text>
        </View>

    )
}


export default CustomInputPassword;