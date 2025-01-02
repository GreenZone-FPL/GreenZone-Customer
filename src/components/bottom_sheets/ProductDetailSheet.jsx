import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { IconButton } from 'react-native-paper'; // Sử dụng IconButton từ react-native-paper
import GLOBAL_KEYS from '../../constants/global_keys';
import colors from '../../constants/color';

const ProductDetailSheet = (props) => {
    const { navigation } = props;
    const [isFavorite, setIsFavorite] = useState(false); // State để xử lý toggle yêu thích
    const [showFullDescription, setShowFullDescription] = useState(false); // State để toggle mô tả

    const hideModal = () => {
        navigation.goBack();
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite); // Đổi trạng thái yêu thích
    };

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription); // Toggle mô tả
    };

    const productDescription =
        "Trà Sữa Trân Châu Hoàng Kim là một thức uống được yêu thích với vị ngọt vừa phải, hương thơm đặc trưng và topping trân châu mềm dẻo. Thích hợp để thưởng thức trong mọi dịp.";

    return (
        <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
                <ProductImage hideModal={hideModal} />
                <ProductInfo 
                    isFavorite={isFavorite} 
                    toggleFavorite={toggleFavorite} 
                />
                <ProductDescription 
                    description={productDescription} 
                    showFullDescription={showFullDescription} 
                    toggleDescription={toggleDescription} 
                />
                <ProductPrice />
                <ActionButtons />
            </ScrollView>
        </View>
    );
};

// Component cho Image
const ProductImage = ({ hideModal }) => (
    <View style={styles.imageContainer}>
        <Image
            source={require('../../assets/images/product1.png')} // Thay thế bằng URL ảnh sản phẩm
            style={styles.productImage}
            resizeMode="cover"
            onError={() => console.error('Failed to load image')}
        />
        <IconButton
            icon="close"
            size={GLOBAL_KEYS.ICON_SIZE_SMALL}
            color={colors.white}
            style={styles.closeButton}
            onPress={hideModal}
        />
    </View>
);

// Component cho tên sản phẩm và nút yêu thích
const ProductInfo = ({ isFavorite, toggleFavorite }) => (
    <View style={styles.horizontalView}>
        <Text
            style={styles.productName}
            numberOfLines={2}
            ellipsizeMode="tail"
        >
            Trà Sữa Trân Châu Hoàng Kim - Vị thơm ngon đặc biệt không thể bỏ lỡ!
        </Text>
        <IconButton
            icon={isFavorite ? "heart" : "heart-outline"}
            size={GLOBAL_KEYS.ICON_SIZE_LARGE}
            iconColor={isFavorite ? colors.primary : colors.gray700}
            onPress={toggleFavorite}
        />
    </View>
);

// Component cho mô tả sản phẩm
const ProductDescription = ({ description, showFullDescription, toggleDescription }) => (
    <View style={styles.descriptionContainer}>
        <Text
            style={styles.descriptionText}
            numberOfLines={showFullDescription ? undefined : 2}
            ellipsizeMode="tail"
        >
            {description}
        </Text>
        <Pressable style={styles.textButton} onPress={toggleDescription}>
            <Text style={styles.textButtonLabel}>
                {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
            </Text>
        </Pressable>
    </View>
);

// Component cho giá sản phẩm
const ProductPrice = () => (
    <View style={styles.priceContainer}>
        <Text style={styles.productPrice}>100.000 ₫</Text>
    </View>
);

// Component cho các nút hành động
const ActionButtons = () => (
    <View style={styles.actionsContainer}>
        <Pressable style={styles.addToCartButton}>
            <Text style={styles.actionButtonText}>Thêm vào giỏ hàng</Text>
        </Pressable>
        <Pressable style={styles.buyNowButton}>
            <Text style={styles.actionButtonText}>Mua ngay</Text>
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.overlay,
        flex: 1,
        width: '100%',
        marginTop: StatusBar.currentHeight + 40
    },
    modalContent: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 300,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: GLOBAL_KEYS.PADDING_DEFAULT,
        right: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.green100,
    },
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        flex: 1,
        marginRight: 8,
        lineHeight: 22,
    },
    descriptionContainer: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        gap: 5,
    },
    descriptionText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray700,
        lineHeight: 22,
    },
    textButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
    },
    textButtonLabel: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.teal900,
    },
    priceContainer: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        marginTop: 10,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.red600,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        marginTop: 16,
    },
    addToCartButton: {
        backgroundColor: colors.green500,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    },
    buyNowButton: {
        backgroundColor: colors.blue500,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    },
    actionButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ProductDetailSheet;
