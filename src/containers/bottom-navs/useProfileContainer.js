import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../context/appContext';
import { useAuthActions } from '../auth/useAuthActions';

export const useProfileContainer = () => {
  const {authDispatch, authState} = useAppContext();
  const {onNavigateLogin, onNavigateRegister} = useAuthActions();

  const navigation = useNavigation();

  return {};
};
