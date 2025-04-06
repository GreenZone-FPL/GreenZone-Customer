import React from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import {
    HorizontalProductItem,
    TitleText
} from "../../../components";
import { colors } from "../../../constants";

interface ProductsInfoProps {
    items: any;
    onEditItem: (item: any) => void;
    confirmDelete: (item: any) => void;
}

export const ProductsInfo: React.FC<ProductsInfoProps> = ({ items, onEditItem, confirmDelete }) => (
    <>
        <TitleText
            text="Sản phẩm"
            style={styles.titleText}
        />

        <FlatList
            data={items}
            keyExtractor={item => item.itemId.toString()}
            renderItem={({ item }) => (
                <Pressable onPress={() => onEditItem(item)}>
                    <HorizontalProductItem
                        confirmDelete={() => confirmDelete(item)}
                        containerStyle={styles.productItemContainer}
                        item={item}
                        enableAction={false}
                        enableDelete={true}
                    />
                </Pressable>
            )}
            contentContainerStyle={styles.listContentContainer}
            nestedScrollEnabled={true}
            scrollEnabled={false}
        />
    </>
);

const styles = StyleSheet.create({
    titleText: {
        color: colors.primary,
        padding: 16,
        backgroundColor: colors.white,
    },
    productItemContainer: {
        paddingHorizontal: 16,
        marginBottom: 0
    },
    listContentContainer: {
        gap: 2,
        marginHorizontal: 0,
    },
});
