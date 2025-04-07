import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { NormalText } from '../../../components';
import { colors } from "../../../constants";
import { AppAsyncStorage, CartManager } from "../../../utils";

interface RecipientInfoProps {
    cartState: any,
    cartDispatch: React.Dispatch<any>
    onChangeRecipientInfo: () => void;
    style?: ViewStyle;
}

export const RecipientInfo: React.FC<RecipientInfoProps> = ({
    cartState,
    cartDispatch,
    onChangeRecipientInfo,
    style,
}) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const handleUserData = async () => {
            try {
                const userData = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.user);
                if (userData) {
                    setUser(userData);
                    if (!cartState?.consigneeName) {
                        CartManager.updateOrderInfo(cartDispatch, {
                            consigneeName: `${userData.firstName} ${userData.lastName}`,
                            consigneePhone: userData.phoneNumber,
                        });
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng từ AsyncStorage:', error);
            }
        };
        handleUserData();
    }, []);

    if (!user) return null;

    const consigneeName =
        cartState?.consigneeName || `${user.firstName} ${user.lastName}`;
    const consigneePhone = cartState?.consigneePhone || user.phoneNumber;

    return (
        <Pressable onPress={onChangeRecipientInfo} style={[styles.container, style]}>
            <NormalText text={`${consigneeName}`} style={styles.consigneeName}/>
            <NormalText text={`${consigneePhone}`} style={styles.phoneText} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderRightColor: colors.gray200,
        borderRightWidth: 1,
    },
    phoneText: {
        color: colors.gray700,
    },
    consigneeName: {
        fontWeight: '500'
    }
});
