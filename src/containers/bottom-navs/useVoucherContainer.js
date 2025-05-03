import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { getProfile } from '../../axios';
import { useAuthContext } from '../../context';
import { AppAsyncStorage } from '../../utils';
export const useVoucherContainer = () => {
  const { authState } = useAuthContext();
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const isTokenValid = await AppAsyncStorage.isTokenValid()
          if (isTokenValid) {
            const response = await getProfile();
            if (response) {
              setUser(response);
            }
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
