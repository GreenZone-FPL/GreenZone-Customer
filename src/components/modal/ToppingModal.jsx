import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Icon, Checkbox } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { OverlayStatusBar } from '../status-bars/OverlayStatusBar';
import { TextFormatter } from '../../utils';
const formatCurrencyVND = amount => {
  return amount.toLocaleString('vi-VN') + 'đ';
};

const ToppingModal = ({ visible, onClose, item, onConfirm, toppings }) => {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const toggleTopping = topping => {
    setSelectedToppings(prev =>
      prev.some(t => t._id === topping._id)
        ? prev.filter(t => t._id !== topping._id)
        : [...prev, topping]
    );
  };

  const totalPrice =
    (item.price + selectedToppings.reduce((sum, t) => sum + t.extraPrice, 0)) *
    quantity;

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalBackground}>
        <OverlayStatusBar />
        <View style={styles.modalContainer}>
          <View style={styles.toppingTitleContainer}>
            <Text style={styles.modalTitle}>{item.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon source="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>Topping (Chọn không giới hạn)</Text>
          <View style={{ maxHeight: 400 }}>
            <FlatList
              data={toppings}
              showsVerticalScrollIndicator={false}
              style={{ flexGrow: 0 }} // Đảm bảo FlatList không mở rộng toàn bộ chiều cao
              keyExtractor={topping => topping._id.toString()}
              renderItem={({ item }) => (
                <View style={styles.toppingRow}>
                  <Checkbox
                    status={selectedToppings.some(t => t._id === item._id) ? 'checked' : 'unchecked'}
                    onPress={() => toggleTopping(item)}
                    color={colors.primary}
                  />
                  <Text style={styles.toppingText}>{item.name}</Text>
                  <Text style={styles.priceText}>{TextFormatter.formatCurrency(item.extraPrice)}</Text>
                </View>
              )}
            />
          </View>


          <View style={styles.toppingRow}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                style={styles.quantityButton}>
                <Icon
                  source="minus"
                  color={colors.primary}
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.quantityButton}>
                <Icon
                  source="plus"
                  color={colors.primary}
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => onConfirm(selectedToppings, quantity)}>
              <Text style={styles.confirmText}>
                {formatCurrencyVND(totalPrice)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: { fontSize: 14, color: 'gray', marginBottom: 10 },
  toppingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
  },
  toppingText: { flex: 1, marginLeft: 10 },
  priceText: { color: 'gray' },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  quantityButton: {
    padding: 12,
    backgroundColor: colors.green200,
    borderRadius: 999,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  quantityText: { fontSize: 16, fontWeight: 'bold' },
  confirmButton: {
    flex: 3,
    backgroundColor: colors.primary,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    borderRadius: 10,
  },
  confirmText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  toppingTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 1,
  },
});

export default ToppingModal;
