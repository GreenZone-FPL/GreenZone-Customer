import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomTabView, LightStatusBar, NormalHeader } from '../../components';
import { colors } from '../../constants';
import { useOrderHistoryContainer } from '../../containers';
import { useCartContext } from '../../context';
import { DialogPaymentMethod } from './order-history-components';
import { CancelDialog } from './order-detail-components';
import { OrderListView } from './order-history-components';


const orderStatuses = ['', 'completed', 'cancelled'];
const titles = ['Đang thực hiện', 'Đã hoàn tất', 'Đã huỷ'];

const OrderHistoryScreen = () => {
  const { cartState } = useCartContext();

  const {
    tabIndex,
    setTabIndex,
    selectedOrder,
    setSelectedOrder,
    orders,
    loading,
    paymentMethod,
    dialogPaymentMethodVisible,
    setDialogPaymentMethodVisible,
    cancelDialogVisible,
    setCancelDialogVisible,
    handleSelectMethod,
    onHeaderPress,
    navigateOrderDetail,
    getPagedOrders,
    setCurrentPage,
    totalPages,
    currentPageMap,
  } = useOrderHistoryContainer()


  return (
    <View style={styles.container}>
      <LightStatusBar />
      <NormalHeader
        title="Lịch sử đơn hàng"
        onLeftPress={onHeaderPress}
      />

      <CustomTabView
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        tabBarConfig={{
          titles: titles,
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}
      >
        {orderStatuses.map((status, index) => (
          <View key={index} style={{ flex: 1 }}>
            <OrderListView

              // orders={mockOrders[status] || []}
              orders={getPagedOrders(status)}
              loading={loading}
              setSelectedOrder={setSelectedOrder}
              onItemPress={navigateOrderDetail}
              onPay={() =>
                setDialogPaymentMethodVisible(true)
              }
              onCancel={() =>
                setCancelDialogVisible(true)
              }
              currentPage={currentPageMap[status] || 1}
              totalPages={totalPages(status)}
              onPageChange={(newPage) => setCurrentPage(status, newPage)}
            />
          </View>
        ))}
      </CustomTabView>

      {
        cancelDialogVisible &&
        <CancelDialog
          visible={cancelDialogVisible}
          onHide={() => setCancelDialogVisible(false)}
          orderId={selectedOrder?._id}
          callBack={() => { }}
        />
      }


      {
        dialogPaymentMethodVisible &&
        <DialogPaymentMethod
          // methods={onlineMethods}
          orderDetail={selectedOrder}
          visible={dialogPaymentMethodVisible}
          onHide={() => setDialogPaymentMethodVisible(false)}
          cartState={cartState}
          selectedMethod={paymentMethod}
          handleSelectMethod={handleSelectMethod}
        />
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  }
});




export default OrderHistoryScreen;