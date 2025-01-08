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
    const [level, setLevel] = useState('');
    const navigation = props.navigation
    return (

        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <NormalHeader title='Thêm địa chỉ mới'
                onLeftPress={() => navigation.goBack()}
                leftIcon='chevron-left' />
            <ScrollView>
                <View style={styles.formContainer}>
                    <Text style={styles.titleForm}>Tên địa chỉ</Text>
                    <FlatInput label={'Nhà...'} setValue={setHome} />
                    <Text style={styles.titleForm}>Địa chỉ</Text>
                    <Pressable style={styles.localtion}
                        onPress={() => navigation.navigate('SearchAddressScreen')}>
                        <Text>Chọn địa chỉ...</Text>
                    </Pressable>
                    <Text style={styles.titleForm}>Tòa nhà, số tầng</Text>
                    <FlatInput label={'Tòa...'}
                        setValue={setHome} />
                    <Text style={styles.titleForm}>Cổng</Text>
                    <FlatInput label={'Cổng'}
                        setValue={setLevel} />
                    <Text style={styles.titleForm}>Ghi chú khác</Text>
                    <FlatInput label={'Ghi chú'}
                        setValue={setTitle} />
                    <Text style={styles.titleForm}>Tên người nhận</Text>
                    <FlatInput label={'Họ tên'}
                        setValue={setName} />
                    <Text style={styles.titleForm}>Số điện thoại</Text>
                    <FlatInput label={'(+84)'}
                        setValue={setPhone} />
                    <PrimaryButton title='Lưu' />
                </View>
            </ScrollView>
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
        gap: GLOBAL_KEYS.GAP_DEFAULT,
        marginBottom: GLOBAL_KEYS.GAP_DEFAULT,
    },
    titleForm: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black
    },
    localtion: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        backgroundColor: colors.white,
        elevation: 4,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
    }
})