import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { GLOBAL_KEYS, colors } from '../../../constants';
import { getProvinces, getDistricts, getWards } from '../../../axios';

const SelectLocation = ({initialAddress = {} , onAddressChange}) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(initialAddress.selectedProvince?.value || null);
    const [selectedDistrict, setSelectedDistrict] = useState(initialAddress.selectedDistrict?.value || null);
    const [selectedWard, setSelectedWard] = useState(initialAddress.selectedWard?.value || null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadProvinces = async () => {
            setIsLoading(true);
            try {
                const response = await getProvinces();
                if (Array.isArray(response)) {
                    setProvinces(response.map(item => ({ label: item.name, value: item.code })));
                }
            } catch (error) {
                console.error('Failed to fetch provinces:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            handleProvinceChange(selectedProvince);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            handleDistrictChange(selectedDistrict);
        }
    }, [selectedDistrict]);


    useEffect(() => {
        if (onAddressChange) {
            onAddressChange({
                selectedProvince: provinces.find(p => p.value === selectedProvince)?.label || null,
                selectedDistrict: districts.find(d => d.value === selectedDistrict)?.label || null,
                selectedWard: wards.find(w => w.value === selectedWard)?.label || null,
            });
        }
    }, [selectedProvince, selectedDistrict, selectedWard]);
    const handleProvinceChange = async (value) => {
        setSelectedProvince(value);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts([]);
        setWards([]);

        try {
            setIsLoading(true);
            const response = await getDistricts(value);
            if (Array.isArray(response)) {
                setDistricts(response.map(item => ({ label: item.name, value: item.code })));
            }
        } catch (error) {
            console.error('Failed to fetch districts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDistrictChange = async (value) => {
        setSelectedDistrict(value);
        setSelectedWard(null);
        setWards([]);

        try {
            setIsLoading(true);
            const response = await getWards(value);
            if (Array.isArray(response)) {
                setWards(response.map(item => ({ label: item.name, value: item.code })));
            }
        } catch (error) {
            console.error('Failed to fetch wards:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        
            <View>
                <Dropdown
                    data={provinces}
                    labelField="label"
                    valueField="value"
                    value={selectedProvince}
                    onChange={item => handleProvinceChange(item.value)}
                    placeholder="Chọn tỉnh/thành phố"
                    placeholderStyle={styles.placeholderText}
                    style={styles.dropdown}
                    selectedTextStyle={styles.dropdownText}
                    search
                    searchPlaceholder="Tìm kiếm..."
                />
                <Dropdown
                    data={districts}
                    labelField="label"
                    valueField="value"
                    value={selectedDistrict}
                    onChange={item => handleDistrictChange(item.value)}
                    placeholder="Chọn quận/huyện"
                    placeholderStyle={styles.placeholderText}
                    style={[styles.dropdown, { opacity: districts.length > 0 ? 1 : 0.5 }]}
                    disable={districts.length === 0}
                    selectedTextStyle={styles.dropdownText}
                     search
                    searchPlaceholder="Tìm kiếm..."
                />
                <Dropdown
                    data={wards}
                    labelField="label"
                    valueField="value"
                    value={selectedWard}
                    onChange={item => setSelectedWard(item.value)}
                    placeholder="Chọn phường/xã"
                    placeholderStyle={styles.placeholderText}
                    style={[styles.dropdown, { opacity: wards.length > 0 ? 1 : 0.5 }]}
                    disable={wards.length === 0}
                    selectedTextStyle={styles.placeholderText}
                    search
                    searchPlaceholder="Tìm kiếm..."
                    selectedTextProps={styles.placeholderText}
                    itemTextStyle={styles.placeholderText}
                />
            </View>
    );
};
const styles = StyleSheet.create({
    dropdown: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        paddingHorizontal: 16,
        height: 50,
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderBottomColor: colors.primary,
        borderBottomWidth: 3,
        fontSize: 12
    },
    placeholderText: {
        fontSize: 12,
        color: colors.black,
    },
    dropdownText: {
        fontSize: 12,
        color: colors.black,
    },
    button: {
        backgroundColor: colors.primary,
        marginTop: 10
    },
    buttonDisabled: {
        backgroundColor: colors.gray200,
    }
});

export default SelectLocation;
