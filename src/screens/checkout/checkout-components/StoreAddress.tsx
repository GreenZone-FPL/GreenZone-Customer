import React from "react";
import { StyleSheet, View } from "react-native";
import { DualTextRow, NormalText, TitleText } from '../../../components';
import { GLOBAL_KEYS, colors } from "../../../constants";

interface StoreAddressProps {
    storeInfo: any;
    chooseMerchant: () => void;
}

export const StoreAddress: React.FC<StoreAddressProps> = ({ storeInfo, chooseMerchant }) => {
    console.log('storeInfo', JSON.stringify(storeInfo, null, 2))
    return (
        <View style={styles.containerItem}>
            <DualTextRow
                style={styles.dualTextRow}
                leftText="Địa chỉ cửa hàng"
                leftTextStyle={styles.leftText}
                rightText="Thay đổi"
                rightTextStyle={styles.rightText}
                onRightPress={chooseMerchant}
            />
            {storeInfo?.storeName && storeInfo?.storeAddress ? (
                <>
                    <TitleText
                        text={storeInfo.storeName}
                        style={styles.storeName}
                    />
                    <NormalText text={storeInfo.storeAddress} />
                </>
            ) : (
                <NormalText
                    text="Vui lòng chọn địa chỉ cửa hàng"
                    style={styles.warningText}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    containerItem: {
        marginBottom: GLOBAL_KEYS.PADDING_SMALL,
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.white,
    },
    dualTextRow: {
        marginVertical: 0,
        marginBottom: 8,
    },
    leftText: {
        fontWeight: '600',
    },
    rightText: {
        color: colors.primary,
    },
    storeName: {
        marginBottom: 8,
        color: colors.lemon,
    },
    warningText: {
        color: colors.orange700,
    },
});
