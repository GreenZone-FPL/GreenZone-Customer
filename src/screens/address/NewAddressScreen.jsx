import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import { FlatInput, LightStatusBar, NormalHeader, PrimaryButton, ActionDialog } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { UserGraph } from '../../layouts/graphs';
import { postAddress, setDefaultAddress, updateAddress, deleteAddress } from '../../axios';
import { useAppContext } from '../../context/appContext';
import { Icon } from 'react-native-paper';
import ToggleSwitch from "toggle-switch-react-native";

const NewAddressScreen = (props) => {
    const { navigation, route } = props;
    const { address } = route.params || {}; // Nhận dữ liệu từ navigation
    const { selectedAddress, setSelectedAddress, setRecipientInfo, recipientInfo } = useAppContext();
    const isEditMode = !!address; // Nếu address có dữ liệu -> Chế độ chỉnh sửa
    const [home, setHome] = useState(isEditMode ? address?.home || '' : '');
    const [name, setName] = useState(isEditMode ? address?.consigneeName || '' : '');
    const [phone, setPhone] = useState(isEditMode ? address?.consigneePhone || '' : '');
    const [specificAddress, setSpecificAddress] = useState(isEditMode ? address?.specificAddress || '' : '');
    const [isLoading, setIsLoading] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            setSelectedAddress({
                selectedDistrict: { label: address.district, value: address.district },
                selectedProvince: { label: address.province, value: address.province },
                selectedWard: { label: address.ward, value: address.ward },
                specificAddress: address.specificAddress
            });
        }
    }, [address]);

    useEffect(() => {
        setRecipientInfo({ home, name, phone });
    }, [home, name, phone, setRecipientInfo]);

    const handleSave = async () => {
        if (!specificAddress || !name || !phone) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        setIsLoading(true);
    
        const requestData = {
            specificAddress,
            ward: selectedAddress?.selectedWard?.label || '',
            district: selectedAddress?.selectedDistrict?.label || '',
            province: selectedAddress?.selectedProvince?.label || '',
            consigneePhone: phone.trim(),  // Đảm bảo không có khoảng trắng thừa
            consigneeName: name.trim(),    // Đảm bảo không có khoảng trắng thừa
            isDefault: isOn,
        };
        try {
            let response;
            if (isEditMode) {
                response = await updateAddress(address._id, requestData);
            } else {
                response = await postAddress(requestData);
            }
            setHome('');
            setName('');
            setPhone('');
            setSpecificAddress('');
            setSelectedAddress(null);
            setIsOn(false);
            setRecipientInfo({ home: '', name: '', phone: '' });
    
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", "Không thể lưu địa chỉ. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = () => {
        setDialogVisible(true);
    };
    
    const confirmDelete = async () => {
        if (!address?._id) return;
    
        try {
            setIsLoading(true);
            await deleteAddress(address._id);
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa địa chỉ. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
            setDialogVisible(false);
        }
    };

    const handleToggle = async (newState) => {
        if (!address?._id) {
            alert("Không tìm thấy ID địa chỉ.");
            return;
        }
    
        setIsOn(newState); // Cập nhật UI trước để phản hồi nhanh
    
        const result = await setDefaultAddress(address._id); // Gọi API
    
        if (!result.success) {
            alert(result.message);
            setIsOn(!newState); // Hoàn tác nếu API thất bại
        } else {
            alert(result.message); // Hiển thị thông báo thành công
        }
    };
    
    
    
    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <NormalHeader title={isEditMode ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"} onLeftPress={() => navigation.goBack()} />
            <View style={styles.formContainer}>
                <View>
                    <FlatInput label="Tên địa chỉ" value={home} setValue={setHome} placeholder="Nhà" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginVertical: 4 }}>
                        <Text style={styles.normalText}>Đặt làm địa chỉ mặc định</Text>
                        <ToggleSwitch
                            isOn={isOn}
                            onColor={colors.primary}
                            offColor={colors.gray200}
                            labelStyle={{ color: "black", fontWeight: "bold", height: 30 }}
                            size="small"
                            onToggle={handleToggle}
                        />
                    </View>
                </View>

                <Pressable
                    style={styles.location}
                    onPress={() => navigation.navigate(UserGraph.SearchAddressScreen)}
                    disabled={isLoading}
                >
                    <Text style={styles.normalText}>
                        {(selectedAddress?.specificAddress || selectedAddress?.selectedWard?.label || selectedAddress?.selectedDistrict?.label || selectedAddress?.selectedProvince?.label) 
                            ? `${selectedAddress.specificAddress || ''}, ${selectedAddress.selectedWard?.label || ''}, ${selectedAddress.selectedDistrict?.label || ''}, ${selectedAddress.selectedProvince?.label || ''}`.trim().replace(/^, |, $/g, '')
                            : 'Chọn địa chỉ'}
                    </Text>
                </Pressable>
                
                <FlatInput label="Địa chỉ cụ thể" setValue={setSpecificAddress} value={specificAddress} placeholder="Ngõ/ngách/..." />
                <FlatInput label="Người nhận" setValue={setName} value={name} placeholder="Họ tên" />
                <FlatInput label="Số điện thoại" setValue={setPhone} value={phone} placeholder="(+84)" />
                {isEditMode && (
                    <>
                        <Pressable style={styles.btnDelete} onPress={handleDelete} disabled={isLoading}>
                            <Icon source={"delete-circle"} size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
                            <Text style={styles.normalText}>Xóa</Text>
                        </Pressable>

                        <ActionDialog
                            visible={dialogVisible}
                            title="Xác nhận xóa"
                            content="Bạn có chắc chắn muốn xóa địa chỉ này?"
                            cancelText="Hủy"
                            approveText="Xóa"
                            onCancel={() => setDialogVisible(false)}
                            onApprove={confirmDelete}
                        />
                    </>
                )}

                <PrimaryButton title={isEditMode ? "Cập nhật" : "Lưu"} onPress={handleSave} disabled={isLoading} />
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
        color: colors.black,
        
    },
    btnDelete:{
        flexDirection: 'row', 
        alignItems: 'center',
    },
})