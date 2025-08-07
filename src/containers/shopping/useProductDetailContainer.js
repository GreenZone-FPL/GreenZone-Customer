// import { useAuthContext } from '../../context';
// import { useAuthActions } from '../auth/useAuthActions';

// export const useProductDetailContainer = () => {
//   const {authState} = useAuthContext();
//   const {onNavigateLogin} = useAuthActions();

//   const onClickAddToCart = async addToCart => {
//     try {
//       if (authState.lastName) {
//         if (addToCart) addToCart();
//       } else {
//         onNavigateLogin();
//       }
//     } catch (error) {
//       console.log('Error', error);
//     }
//   };

//   return {
//     onClickAddToCart,
//   };
// };

import {useEffect, useState} from 'react';
import axios from 'axios';

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://your-api.com/products');
        if (isMounted) {
          setProducts(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Something went wrong');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return {products, loading, error};
};

io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);

  // Join room
  socket.on('join_room', room => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  // Send message to room
  socket.on('send_message', data => {
    io.to(data.room).emit('receive_message', data);
  });

  // Leave room
  socket.on('leave_room', room => {
    socket.leave(room);
  });
});
