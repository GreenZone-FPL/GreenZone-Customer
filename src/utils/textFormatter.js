export const TextFormatter = {
  // Định dạng số lượng, đảm bảo số lượng tối thiểu có 2 chữ số.
  formatQuantity(quantity) {
    return quantity === 0 ? '0' : String(quantity).padStart(2, '0');
  },

  // Định dạng văn bản số lượng sản phẩm.
  formatTextProduct(quantity) {
    return quantity > 1 ? `${quantity} products` : `${quantity} product`;
  },

  // Định dạng tiền tệ theo đơn vị VND.
  formatCurrency(amount) {
    if (amount == null) return 'co cai nit';
    return amount
      .toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})
      .replace(/\s₫/, '₫');
  },

  // Định dạng ngày tháng (YYYY-MM-DD HH:mm:ss).
  formatDate(date) {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  // Định dạng ngày/tháng/năm giờ:phút
  formatDateSimple(dateString) {
    const date = new Date(dateString);

    const padZero = n => (n < 10 ? '0' + n : n);

    return `${padZero(date.getDate())}-${padZero(
      date.getMonth() + 1,
    )}-${date.getFullYear()} - ${padZero(date.getHours())} giờ ${padZero(
      date.getMinutes(),
    )} phút`;
  },
  formatted(value) {
    if (value == null || isNaN(value)) return '0';
    return value.toLocaleString('vi-VN');
  },
};

function pad(value) {
  return String(value).padStart(2, '0');
}
