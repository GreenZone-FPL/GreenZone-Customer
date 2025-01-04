import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { IconButton } from 'react-native-paper';
import GLOBAL_KEYS from '../../constants/global_keys';
import colors from '../../constants/color';
import RadioGroup from '../radio/RadioGroup';
import OverlayStatusBar from '../status_bars/OverlayStatusBar';




const ProductDetailSheet = (props) => {

    const { navigation } = props;
    const [isFavorite, setIsFavorite] = useState(false); // State để xử lý toggle yêu thích
    const [showFullDescription, setShowFullDescription] = useState(false); // State để toggle mô tả

    const [selectedSize, setSelectedSize] = useState(sizes[0].value); // Giá trị mặc định
    const [selectedSugarLevel, setSelectedSugarLevel] = useState(sugarLevels[0].value); // Giá trị mặc định
    const [selectedIceLevel, setSelectedIceLevel] = useState(iceLevels[0].value); // Giá trị mặc định


    const hideModal = () => {
        navigation.goBack();
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };


    {/** Hàm Ẩn / Hiện mô tả sản phẩm */ }
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const productDescription =
        "Trà Sữa Trân Châu Hoàng Kim là một thức uống được yêu thích với vị ngọt vừa phải, hương thơm đặc trưng và topping trân châu mềm dẻo. Thích hợp để thưởng thức trong mọi dịp.";

    return (
        <View style={styles.modalContainer}>
            <OverlayStatusBar />
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




                <RadioGroup
                    items={sizes}
                    selectedValue={selectedSize}
                    onValueChange={setSelectedSize}
                    title="Size"
                    required={true}
                    note="Bắt buộc"
                />



                <RadioGroup
                    items={sugarLevels}
                    selectedValue={selectedSugarLevel}
                    onValueChange={setSelectedSugarLevel}
                    title="Chọn mức đường"
                    required={true}
                />

                <RadioGroup
                    items={iceLevels}
                    selectedValue={selectedIceLevel}
                    onValueChange={setSelectedIceLevel}
                    title="Chọn mức đá"
                    required={true}
                />





            </ScrollView>
        </View>
    );
};

const sizes = [
    { label: 'S', value: 'S', additionalInfo: '10000đ' },
    { label: 'M', value: 'M', additionalInfo: '15000đ' },
    { label: 'L', value: 'L', additionalInfo: '20000đ' },
    { label: 'XL', value: 'XL', additionalInfo: '25000đ' },
];

const sugarLevels = [
    { label: 'Ngọt bình thường', value: 'Ngọt bình thường' },
    { label: 'Ít ngọt', value: 'Ít ngọt' }
];

const iceLevels = [
    { label: '100%', value: '100%' },
    { label: '50%', value: '50%' }
];

const ProductImage = ({ hideModal }) => (
    <View style={styles.imageContainer}>
        <Image
            source={require('../../assets/images/product1.png')}
            style={styles.productImage}

            onError={() =>
                // Set placeholder cho image
                console.error('Failed to load image')
            }
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

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.overlay,
        flex: 1,
        width: '100%',

    },
    modalContent: {
        width: '100%',
        backgroundColor: colors.white,
        flexDirection: 'column',
        gap: 5,
        marginTop: StatusBar.currentHeight + 40
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 300,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
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
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    column: {
        flexDirection: 'column',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        flex: 1,
        marginRight: 8,
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    },
    descriptionContainer: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    descriptionText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray700,
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    },
    title: {
        fontWeight: 'bold',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    textButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
    },
    redText: {
        color: colors.red800
    },
    textButtonLabel: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.teal900,
    },
    price: {
        color: 'black',
        fontSize: 16,
    },
    selectedSize: {
        color: 'black',
        marginTop: 10,
        fontSize: 16,
    },

    radioGroup: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL
    }
});

export default ProductDetailSheet;
