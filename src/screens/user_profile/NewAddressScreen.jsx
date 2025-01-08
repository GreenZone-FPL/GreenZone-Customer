import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import NormalHeader from '../../components/headers/NormalHeader';
import LightStatusBar from '../../components/status-bars/LightStatusBar';
import colors from '../../constants/color';
import GLOBAL_KEYS from '../../constants/globalKeys';
import FlatInput from '../../components/inputs/FlatInput';
import PrimaryButton from '../../components/buttons/PrimaryButton';


const NewAddressScreen = (props) => {
    const [home, setHome] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const navigation = props.navigation
    return (

        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <NormalHeader title='Thêm địa chỉ mới'
                onLeftPress={() => navigation.goBack()}/>
                <View style={styles.formContainer}>
                    <FlatInput label={'Tên địa chỉ'} setValue={setHome} />
                    <Pressable style={styles.location}
                        onPress={() => navigation.navigate('SearchAddressScreen')}>
                        <Text>Chọn địa chỉ...</Text>
                    </Pressable>
                    <FlatInput label={'Ghi chú'}
                        setValue={setTitle} />
                    <FlatInput label={'Họ tên người nhận'}
                        setValue={setName} />
                    <FlatInput label={'(+84)'}
                        setValue={setPhone} />
                    <PrimaryButton title='Lưu' />
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
        gap: 24,
        marginBottom: GLOBAL_KEYS.GAP_DEFAULT,
    },
    location: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
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
    }
})