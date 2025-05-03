import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../context';
import { useAuthActions } from '../auth/useAuthActions';

export const useProfileContainer = () => {
  const {authDispatch, authState} = useAuthContext();
  const {onNavigateLogin, onNavigateRegister} = useAuthActions();

  const navigation = useNavigation();

  return {};
};
