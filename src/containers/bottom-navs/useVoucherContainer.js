import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { getProfile } from '../../axios';
import { useAppContext } from '../../context/appContext';
export const useVoucherContainer = () => {
  const { authState } = useAppContext();
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const response = await getProfile();
          if (response) {
            setUser(response);
          }
        } catch (error) {
          console.log('error', error);
        }
      };

      fetchProfile();
    }, [])
  );


  return { authState, user };
};
