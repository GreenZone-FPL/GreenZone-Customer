import React, { useCallback, useMemo, useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import ProductDetailContent from './ProductDetailContent';

const GorHome = () => {
    const bottomSheetRef = useRef(null);

    // Điểm neo cho BottomSheet (ví dụ: 25%, 50%, 95%)
    const snapPoints = useMemo(() => ["25%", "50%", "95%"], []);

    // Hàm theo dõi khi BottomSheet thay đổi vị trí
    const handleSheetChanges = useCallback((index) => {
        console.log('BottomSheet index:', index);
        if (index === 0 && bottomSheetRef.current) {
            bottomSheetRef.current.close();
        }
    }, []);
    

    const openProductDetail = () => {
        bottomSheetRef.current?.expand(); // Mở rộng BottomSheet
    };

    const renderBackdrop = useMemo(() => (props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={1} appearsOnIndex={2} />
    ), []);
    

    return (
        <GestureHandlerRootView style={styles.container}>
            <Button title="Xem sản phẩm" onPress={openProductDetail} />
            <BottomSheet
                enablePanDownToClose
                ref={bottomSheetRef}
                index={-1} // Ẩn BottomSheet khi khởi động
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
                enableDynamicSizing={false}
                handleComponent={null} // Ẩn phần "đỉnh"
            >
                <BottomSheetScrollView style={styles.contentContainer}>
                    <ProductDetailContent productId={'67ad9e9b145c78765a8f89c1'} closeSheet={() => bottomSheetRef.current?.close()} />
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
});

export default GorHome;
