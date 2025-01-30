import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Button, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const TestGorhom = () => {
  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
        pressBehavior="close"
      />
    ),
    []
  );

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand(); // Opens the BottomSheet
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Button to open BottomSheet */}
      <Button title="Open Bottom Sheet" onPress={openBottomSheet} />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Default to collapsed state
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    // flex: 1,
    alignItems: "center",
  },
});

export default TestGorhom;
