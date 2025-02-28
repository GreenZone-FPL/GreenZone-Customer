import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import { FlatInput, LightStatusBar, NormalHeader, PrimaryButton } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { UserGraph } from '../../layouts/graphs';
import { postAddress, setDefaultAddress } from '../../axios';
import { useAppContext } from '../../context/appContext';
import ToggleSwitch from "toggle-switch-react-native";

const NewAddressScreen = (props) => {
    const { navigation, route } = props;
    const { address } = route.params || {}; // Nhận dữ liệu từ navigation
    const { selectedAddress, setSelectedAddress, setRecipientInfo, recipientInfo } = useAppContext();

    const [home, setHome] = useState(recipientInfo.home || '');
    const [name, setName] = useState(recipientInfo.name || '');
    const [phone, setPhone] = useState(recipientInfo.phone || '');
    const [specificAddress, setSpecificAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        if (address) {
            console.log("Địa chỉ nhận được từ navigation:", address);
            setSelectedAddress({
                selectedDistrict: { label: address.district, value: address.district }, 
                selectedProvince: { label: address.province, value: address.province }, 
                selectedWard: { label: address.ward, value: address.ward }, 
                specificAddress: address.specificAddress
            });
        }
    }, [address]);
    
    useEffect(() => {
        if (selectedAddress) {
            console.log("Địa chỉ nhận được từ chọn địa chỉ:", selectedAddress);
            setSpecificAddress(selectedAddress.specificAddress || '');
        }
    }, [selectedAddress]);
    
    

    useEffect(() => {
        setRecipientInfo({ home, name, phone });
    }, [home, name, phone, setRecipientInfo]);


    const handleSave = async () => {
        if (!specificAddress || !name || !phone) {
            return;
        }
        setIsLoading(true);
        try {
            const requestData = {
                specificAddress,
                ward: selectedAddress?.selectedWard?.label || '',
                district: selectedAddress?.selectedDistrict?.label || '',
                province: selectedAddress?.selectedProvince?.label || '',
                consigneePhone: phone,
                consigneeName: name
            };
            const response = await postAddress(requestData);
            console.log('API response:', response);
            // navigation.goBack();
            navigation.navigate('AddressScreen');
        } catch (error) {
            console.log('Save error:', error?.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <NormalHeader title="Thêm địa chỉ mới" onLeftPress={() => navigation.goBack()} />
            <View style={styles.formContainer}>
                <View>
                    <FlatInput label="Tên địa chỉ" value={home} setValue={setHome} placeholder="Nhà" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginVertical: 4}}>
                        <Text style={styles.normalText}>Đặt làm địa chỉ mặc định</Text>
                        <ToggleSwitch
                            isOn={isOn}
                            onColor={colors.primary}
                            offColor={colors.gray200}
                            labelStyle={{ color: "black", fontWeight: "bold", height: 30 }}
                            size="small"
                            onToggle={(newState) => setIsOn(newState)}
                        />
                    </View>
                </View>
    
                <Pressable
                    style={styles.location}
                    onPress={() => navigation.navigate(UserGraph.SearchAddressScreen)}
                    disabled={isLoading}
                >
                    <Text style={styles.normalText}>
                        {selectedAddress
                            ? `${selectedAddress.specificAddress || ''}, ${selectedAddress.selectedWard?.label || ''}, ${selectedAddress.selectedDistrict?.label || ''}, ${selectedAddress.selectedProvince?.label || ''}`
                            : address
                                ? `${address.specificAddress || ''}, ${address.ward || ''}, ${address.district || ''}, ${address.province || ''}`
                                : 'Chọn địa chỉ'}
                    </Text>

                </Pressable>
                <FlatInput label="Địa chỉ cụ thể" setValue={setSpecificAddress} value={specificAddress} placeholder="Ngõ/ngách/..." />
                <FlatInput label="Người nhận" setValue={setName} value={name} placeholder="Họ tên" />
                <FlatInput label="Số điện thoại" setValue={setPhone} value={phone} placeholder="(+84)" />
                <PrimaryButton title={"Lưu"} onPress={handleSave} disabled={isLoading} />
            </View>
        </SafeAreaView>
    );
};


export default NewAddressScreen;

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