import React, {useMemo} from "react";
import { Image, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import {
    DialogBasic,
    NormalText,
    Row
} from '../../../components';
import { colors, DeliveryMethod, PaymentMethod } from "../../../constants";
import { PaymentMethodItem } from "../../../type/checkout";

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
    methods: PaymentMethodItem[],
    visible: boolean;
    onHide: () => void;
    cartState: any;
    selectedMethod: PaymentMethodItem,
    handleSelectMethod: (method: PaymentMethodItem, disabled: boolean) => void;
}

export const DialogPaymentMethod: React.FC<DialogPaymentMethodProps> = ({
    methods = paymentMethods,
    visible,
    onHide,
    cartState,
    selectedMethod,
    handleSelectMethod
  }) => {
  
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
      {
        visible && 
        <DialogBasic
        isVisible={visible}
        onHide={onHide}
        title="Chọn phương thức thanh toán"
      >
        <RadioButton.Group
          onValueChange={(value) => {
            const method = methodOptions.find(m => m.value === value);
            if (!method) return;
            handleSelectMethod(method, method.disabled);
          }}
          value={selectedMethod?.value}
        >
          {methodOptions.map(method => (
            <Row key={method.value} style={styles.methodItem}>
              <RadioButton
                disabled={method.disabled}
                value={method.value}
                color={colors.primary}
              />
              <Image source={method.image} style={styles.image} />
              <NormalText
                text={method.disabled ?  `${method.label} (Không khả dụng)` : method.label }
                style={method.disabled ? styles.disabledText : styles.text}
              />
            </Row>
          ))}
        </RadioButton.Group>
      </DialogBasic>
      }
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
});
