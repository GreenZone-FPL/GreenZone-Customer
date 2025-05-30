import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { getProfile } from "../../../axios";
import { NormalText } from '../../../components';
import { colors, GLOBAL_KEYS } from "../../../constants";
import { CartManager } from "../../../utils";

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
                const userData: any = await getProfile();
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
                console.log('Error fetching Profile', error);
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
            <NormalText text={`${consigneeName}`} style={styles.consigneeName} />
            <NormalText text={`${consigneePhone}`} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderRightColor: colors.primary,
        borderRightWidth: 5,
    },
    consigneeName: {
        fontWeight: '500',
        color: colors.lemon,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE
    }
});
