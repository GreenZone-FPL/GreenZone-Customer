import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import NormalHeader from '../../components/headers/NormalHeader';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import FlatInput from '../../components/inputs/FlatInput';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import ScreenEnum from '../../constants/screenEnum';


const NewAddressScreen = (props) => {
    const [home, setHome] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const navigation = props.navigation
    return (

        <SafeAreaView style={styles.container}>
            <LightStatusBar />

            <NormalHeader
                title='Thêm địa chỉ mới'
                onLeftPress={() => navigation.goBack()} />

            <View style={styles.formContainer}>
                <FlatInput
                    label={'Tên địa chỉ'}
                    value={home}
                    setValue={setHome}
                    placeholder='Nhà' />

                <Pressable
                    style={styles.location}
                    onPress={() => navigation.navigate(ScreenEnum.SearchAddressScreen)}>
                    <Text style={styles.normalText}>Chọn địa chỉ...</Text>
                </Pressable>

                <FlatInput
                    label={'Ghi chú'}
                    setValue={setNote}
                    value={note}
                    placeholder='Ghi chú' />

                <FlatInput
                    label={'Người nhận'}
                    setValue={setName}
                    value={name}
                    placeholder='Họ tên' />

                <FlatInput
                    label={'Số điện thoại'}
                    setValue={setPhone}
                    value={phone}
                    placeholder='(+84)' />

                <PrimaryButton title='Lưu' onPress={() => { }} />
            </View>
        </SafeAreaView>
    )
}

export default NewAddressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
    },
    formContainer: {
        flex: 1,
        marginHorizontal: GLOBAL_KEYS.GAP_DEFAULT,
        gap: 32,
        marginBottom: GLOBAL_KEYS.GAP_DEFAULT,
    },
    location: {
        backgroundColor: colors.white,
        elevation: 4,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        borderBottomColor: colors.primary,
        borderBottomWidth: 1,
    },
    normalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black
    }
})