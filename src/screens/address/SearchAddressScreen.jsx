import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, ActivityIndicator, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'react-native-paper';
import { CustomSearchBar, LightStatusBar, DialogBasic, FlatInput, PrimaryButton } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { UserGraph } from '../../layouts/graphs';
import { getProvinces, getDistricts, getWards } from '../../axios/modules/adress';

const SearchAddressScreen = (props) => {
    const navigation = props.navigation;
    const [searchQuery, setsearchQuery] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [addressList, setAddressList] = useState([]); // Danh sách địa chỉ

    const handleSelectAddress = (selectedAddress) => {
        setAddressList([...addressList, selectedAddress]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LightStatusBar />
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon
                        source="arrow-left"
                        color={colors.black}
                        size={GLOBAL_KEYS.ICON_SIZE_LARGE}
                    />
                </Pressable>

                <CustomSearchBar
                    placeholder="Tìm kiếm..."
                    searchQuery={searchQuery}
                    setSearchQuery={setsearchQuery}
                    onClearIconPress={() => setsearchQuery('')}
                    leftIcon="magnify"
                    rightIcon="close"
                    style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray300 }}
                />
            </View>

            <Pressable
                style={styles.map}
                onPress={() => navigation.navigate(UserGraph.SelectAddressScreen)}>
                <Icon
                    source="map-search"
                    color={colors.primary}
                    size={GLOBAL_KEYS.ICON_SIZE_LARGE}
                />
                <Text style={styles.normalText}>Chọn trên bản đồ</Text>
                <Icon
                    source="chevron-right"
                    color={colors.primary}
                    size={GLOBAL_KEYS.ICON_SIZE_LARGE}
                />
            </Pressable>

            <Pressable style={styles.map} onPress={() => setIsVisible(true)}>
                <Icon
                    source="form-select"
                    color={colors.primary}
                    size={GLOBAL_KEYS.ICON_SIZE_LARGE}
                />
                <Text style={styles.normalText}>Chọn địa chỉ</Text>
                <Icon
                    source="chevron-down"
                    color={colors.primary}
                    size={GLOBAL_KEYS.ICON_SIZE_LARGE}
                />
            </Pressable>
            {addressList.length > 0 && (
                <View style={{ gap: GLOBAL_KEYS.GAP_DEFAULT, margin: 16, borderWidth: 1, borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT, borderColor: colors.gray200, padding: 16 }}>
                    {addressList.map((address, index) => (
                        <Card key={index} address={address} onPress={() => { }} />
                    ))}
                </View>
            )}
            <SelectAddressDialog isVisible={isVisible} setIsVisible={setIsVisible} onSelectAddress={handleSelectAddress} />
        </SafeAreaView>
    );
};

const Card = ({ address, onPress }) => (
    <Pressable style={styles.card} onPress={onPress}>
        <Icon source="google-maps" size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} />
        <View style={styles.textContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE }}>{address?.note || ''}</Text>
            <Text style={styles.location}>
                {address?.note || ''} {address?.phuong || ''} {address?.quan || ''} {address?.tinh || ''}
            </Text>
            <Text style={styles.distance}>0.8km</Text>
        </View>
    </Pressable>
);

const SelectAddressDialog = ({ isVisible, setIsVisible, onSelectAddress }) => {
    const [tinhThanh, setTinhThanh] = useState([]);
    const [quanHuyen, setQuanHuyen] = useState([]);
    const [phuongXa, setPhuongXa] = useState([]);

    const [selectedTinh, setSelectedTinh] = useState('');
    const [selectedQuan, setSelectedQuan] = useState('');
    const [selectedPhuong, setSelectedPhuong] = useState('');
    const [note, setNote] = useState('');

    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState(null);

    const isConfirmDisabled = !selectedTinh || !selectedQuan || !selectedPhuong;

    useEffect(() => {
        fetchTinhThanh();
    }, []);

    const fetchTinhThanh = async () => {
        try {
            const data = await getProvinces();
            setTinhThanh(data);
        } catch (error) {
            console.error('Lỗi tải tỉnh thành:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuanHuyen = async (provinceCode) => {
        setSelectedTinh(provinceCode);
        setQuanHuyen([]);
        setPhuongXa([]);
        setSelectedQuan('');
        setSelectedPhuong('');

        if (!provinceCode) return;

        try {
            const data = await getDistricts(provinceCode);
            setQuanHuyen(data);
        } catch (error) {
            console.error('Lỗi tải quận huyện:', error);
        }
    };

    const fetchPhuongXa = async (districtCode) => {
        setSelectedQuan(districtCode);
        setPhuongXa([]);
        setSelectedPhuong('');

        if (!districtCode) return;

        try {
            const data = await getWards(districtCode);
            setPhuongXa(data);
        } catch (error) {
            console.error('Lỗi tải phường xã:', error);
        }
    };

    const handleConfirm = () => {
        const selectedAddress = {
            tinh: tinhThanh.find(item => item.code === selectedTinh)?.name || '',
            quan: quanHuyen.find(item => item.code === selectedQuan)?.name || '',
            phuong: phuongXa.find(item => item.code === selectedPhuong)?.name || '',
            note: note
        };

        onSelectAddress(selectedAddress);
        setIsVisible(false);
    };

    return (
        <DialogBasic isVisible={isVisible} onHide={() => setIsVisible(false)} title="Chọn địa chỉ">
            {loading ? <ActivityIndicator size="large" color="blue" /> : (
                <View style={{ gap: GLOBAL_KEYS.GAP_DEFAULT }}>
                    <TouchableOpacity
                        style={styles.selectionBox}
                        onPress={() => setModalType('tinh')}
                    >
                        <Text style={styles.textLocal}>{selectedTinh ? tinhThanh.find(item => item.code === selectedTinh)?.name : "Chọn Tỉnh Thành"}</Text>
                        <Icon source="chevron-down" color={colors.primary} size={GLOBAL_KEYS.ICON_SIZE_LARGE} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.selectionBox}
                        onPress={() => quanHuyen.length > 0 && setModalType('quan')}
                        disabled={quanHuyen.length === 0}
                    >
                        <Text style={styles.textLocal}>{selectedQuan ? quanHuyen.find(item => item.code === selectedQuan)?.name : "Chọn Quận Huyện"}</Text>
                        <Icon source="chevron-down" color={colors.primary} size={GLOBAL_KEYS.ICON_SIZE_LARGE} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.selectionBox}
                        onPress={() => phuongXa.length > 0 && setModalType('phuong')}
                        disabled={phuongXa.length === 0}
                    >
                        <Text style={styles.textLocal}>{selectedPhuong ? phuongXa.find(item => item.code === selectedPhuong)?.name : "Chọn Phường Xã"}</Text>
                        <Icon source="chevron-down" color={colors.primary} size={GLOBAL_KEYS.ICON_SIZE_LARGE} />
                    </TouchableOpacity>

                    <FlatInput label={'Nhập chi tiết '} setValue={setNote} value={note} placeholder='Số nhà/ngách/hẻm/...' />

                    <PrimaryButton
                        title={'Xác nhận'}
                        onPress={handleConfirm}
                        disabled={isConfirmDisabled}
                        style={{ backgroundColor: isConfirmDisabled ? colors.gray200 : colors.primary }}
                    />
                </View>
            )}

            <Modal visible={modalType !== null} animationType="slide">
                <View style={{ flex: 1, padding: 20 }}>
                    <Text style={{ fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER, fontWeight: 'bold', marginBottom: 10 }}>Chọn {modalType === 'tinh' ? "Tỉnh Thành" : modalType === 'quan' ? "Quận Huyện" : "Phường Xã"}</Text>
                    <FlatList
                        data={modalType === 'tinh' ? tinhThanh : modalType === 'quan' ? quanHuyen : phuongXa}
                        keyExtractor={item => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.listItem}
                                onPress={() => {
                                    if (modalType === 'tinh') {
                                        fetchQuanHuyen(item.code);
                                        setSelectedTinh(item.code);
                                    } else if (modalType === 'quan') {
                                        fetchPhuongXa(item.code);
                                        setSelectedQuan(item.code);
                                    } else {
                                        setSelectedPhuong(item.code);
                                    }
                                    setModalType(null);
                                }}
                            >
                                <Text style={{ fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT }}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </DialogBasic>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        alignItems: 'center',
        gap: GLOBAL_KEYS.GAP_DEFAULT
    },
    map: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        justifyContent: 'space-between',
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        alignItems: 'center',
        marginTop: GLOBAL_KEYS.GAP_DEFAULT,
        borderRadius: 6,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    normalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black
    },
    selectionBox: {
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listItem: {
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    textLocal: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
    },
    closeButton: {
        backgroundColor: 'red',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10
    },
    card: {
        flexDirection: 'row',
        gap: GLOBAL_KEYS.GAP_DEFAULT,
        alignItems: 'center',
        padding: GLOBAL_KEYS.PADDING_SMALL,
        backgroundColor: colors.white,
        borderRadius: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 8
    },
    location: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
        textAlign: 'justify',
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
        width: '68%'
    },
    distance: {
        color: colors.gray700,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    },
})

export default SearchAddressScreen;