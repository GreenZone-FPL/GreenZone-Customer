import React, {useMemo} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {
  MyBottomSheet,
  NormalText,
  PrimaryButton,
  Row,
} from '../../../components';
import {colors, DeliveryMethod, PaymentMethod} from '../../../constants';
import {PaymentMethodItem} from '../../../type-interface/checkout';

export const onlineMethods: PaymentMethodItem[] = [
  {
    label: 'PayOs',
    image: require('../../../assets/images/logo_payos.png'),
    value: 'payos',
    paymentMethod: PaymentMethod.ONLINE.value,
  },
  {
    label: 'Thẻ Visa, ngân hàng',
    image: require('../../../assets/images/logo_card.png'),
    value: 'card',
    paymentMethod: PaymentMethod.ONLINE.value,
  },
];

// Định nghĩa các phương thức thanh toán
export const paymentMethods: PaymentMethodItem[] = [
  {
    label: 'Thanh toán tiền mặt',
    image: require('../../../assets/images/logo_vnd.png'),
    value: 'cash',
    paymentMethod: PaymentMethod.COD.value,
  },
  {
    label: 'PayOs',
    image: require('../../../assets/images/logo_payos.png'),
    value: 'payos',
    paymentMethod: PaymentMethod.ONLINE.value,
  },
  {
    label: 'Thẻ Visa, ngân hàng',
    image: require('../../../assets/images/logo_card.png'),
    value: 'card',
    paymentMethod: PaymentMethod.ONLINE.value,
  },
];

interface DialogPaymentMethodProps {
  methods: PaymentMethodItem[];
  visible: boolean;
  onHide: () => void;
  cartState: any;
  selectedMethod: PaymentMethodItem;
  handleSelectMethod: (method: PaymentMethodItem, disabled: boolean) => void;
}

export const DialogPaymentMethod: React.FC<DialogPaymentMethodProps> = ({
  methods = paymentMethods,
  visible,
  onHide,
  cartState,
  selectedMethod,
  handleSelectMethod,
}) => {
  const [currentSelected, setCurrentSelected] =
    React.useState<PaymentMethodItem>(selectedMethod);

  const methodOptions = useMemo(() => {
    return methods.map(method => {
      const disabled =
        cartState.deliveryMethod === DeliveryMethod.PICK_UP.value &&
        method.paymentMethod === PaymentMethod.COD.value;

      return {
        ...method,
        disabled,
      };
    });
  }, [methods, cartState.deliveryMethod]);

  return (
    <>
      {visible && (
        <MyBottomSheet
          visible={visible}
          onHide={onHide}
          style={{paddingHorizontal: 16}}
          title="Chọn phương thức thanh toán">
          {methodOptions.map(method => {
            const isSelected = currentSelected?.value === method.value;
            return (
              <Pressable
                key={method.value}
                onPress={() => {
                  if (!method.disabled) {
                    setCurrentSelected(method);
                  }
                }}>
                <Row style={styles.methodItem}>
                  {/* Có thể để lại icon selected nếu muốn */}
                  <RadioButton
                    disabled={method.disabled}
                    value={method.value}
                    status={isSelected ? 'checked' : 'unchecked'}
                    onPress={() => {
                      if (!method.disabled) {
                        setCurrentSelected(method);
                      }
                    }}
                    color={colors.primary}
                  />
                  <Image source={method.image} style={styles.image} />
                  <NormalText
                    text={
                      method.disabled
                        ? `${method.label} (Không khả dụng)`
                        : method.label
                    }
                    style={method.disabled ? styles.disabledText : styles.text}
                  />
                </Row>
              </Pressable>
            );
          })}

          <PrimaryButton
            titleStyle={styles.payTitle}
            style={styles.payButton}
            title="Xác nhận"
            onPress={() =>
              handleSelectMethod(
                currentSelected,
                currentSelected?.disabled ?? false,
              )
            }
          />
        </MyBottomSheet>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 8,
  },
  text: {
    color: colors.black,
  },
  disabledText: {
    color: colors.gray400,
  },
  payTitle: {
    fontSize: 12,
  },
  payButton: {
    marginVertical: 16,
    flex: 1,
    padding: 13,
  },
});
