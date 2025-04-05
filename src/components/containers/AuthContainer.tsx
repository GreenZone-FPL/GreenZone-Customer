import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AuthButton } from '../buttons/AuthButton'
import { colors } from '../../constants'
import { on } from 'events'
import { TitleText } from '../texts/TitleText'
import { Column } from './Column'
import { NormalText } from '../texts/NormalText'


interface AuthContainerProps {
    onPress: () => void
}
export const AuthContainer: React.FC<AuthContainerProps> = ({ onPress }) => {
    return (
        <Column style={styles.container}>
            <ImageBackground
                style={styles.content}
                resizeMode='cover'
                source={require('../../assets/images/tree_bg2.png')}>

                <TitleText text='Đăng nhập' style={styles.title} />
                <NormalText
                    style={styles.description}
                    text={`Đăng nhập app để tích điểm và đổi những ưu đãi 
    chỉ dành riêng cho thành viên bạn nhé`} />

                <AuthButton title='Đăng nhập' onPress={onPress} />
            </ImageBackground>

        </Column>

    )
}



const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.gray200,
        margin: 16,
        borderRadius: 16,
        backgroundColor: colors.white
    },
    content: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    },
    title: {
        fontSize: 16,
        textAlign: 'center'

    },
    description: {
        textAlign: 'center',
        fontSize: 14
    }
})