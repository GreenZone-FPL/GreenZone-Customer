import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Column, NormalText, Row, TitleText } from '../../../components';
import { GLOBAL_KEYS, colors } from '../../../constants';
import { CartManager, TextFormatter } from '../../../utils';

interface FooterProps {
  cartState: any;
  showDialog: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  cartState,
  showDialog
}) => {
  const paymentDetails = CartManager.getPaymentDetails(cartState);

  return (
    <Row style={styles.container}>
      <Column style={{gap: 0}}>
        <TitleText
          style={styles.totalText}
          text={`${TextFormatter.formatCurrency(paymentDetails.paymentTotal)}`}
        />

        {cartState?.voucher && (
          <NormalText
            text={`Bạn tiết kiệm ${TextFormatter.formatCurrency(
              paymentDetails.voucherAmount,
            )}`}
            style={styles.voucherText}
          />
        )}
      </Column>

      <Pressable
        onPress={() => {
          showDialog(); 
        }}
        style={styles.orderButton}>
        <TitleText text="Đặt hàng" style={styles.orderButtonText} />
      </Pressable>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopColor: colors.gray200,
    borderTopWidth: 1,
    justifyContent: 'space-between',
    marginBottom: 6,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  totalText: {
    fontSize: 18,
    color: colors.pink500,
    fontWeight: '700',
  },
  voucherText: {
    color: colors.primary,
    fontWeight: '500',
  },
  orderButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  orderButtonText: {
    color: colors.white,
    textAlign: 'right',
    fontSize: 14,
  },
});
