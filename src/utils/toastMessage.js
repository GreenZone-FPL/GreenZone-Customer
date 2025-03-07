import { BaseToast } from "react-native-toast-message";
import { Icon } from "react-native-paper";
import { colors, GLOBAL_KEYS } from "../constants";


//type	string	Loại Toast (success, error, info)
// text1	string	Tiêu đề chính
// text2	string	Nội dung phụ
// position	string	Vị trí hiển thị (top hoặc bottom)
// visibilityTime	number	Thời gian hiển thị (mặc định 4000ms)
// autoHide	boolean	Ẩn tự động (mặc định true)
// onPress	function	Hàm chạy khi click vào Toast

const toastMessage = {
    custom_success: ({ props, ...rest }) => (
        <BaseToast
            {...rest}
            style={{ backgroundColor: colors.white, alignItems: 'center', borderLeftColor: colors.white, marginHorizontal: 1 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
            }}
            renderLeadingIcon={() => (
                <Icon source={props?.iconName || "check-circle"} size={24} color={colors.red800} style={{ marginLeft: 20 }} />
            )}
        />
    ),
    custom_error: ({ props, ...rest }) => (
        <BaseToast
            {...rest}
            style={{ backgroundColor: colors.white, alignItems: 'center', borderLeftColor: colors.white, marginHorizontal: 16 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: "bold",
            }}
            renderLeadingIcon={() => (
                <Icon source={props?.iconName || "alert-circle"} size={24} color={colors.red800} style={{ marginLeft: 20 }} />
            )}
        />
    ),
};

export default toastMessage;
