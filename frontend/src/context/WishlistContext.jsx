import { createContext, useContext, useState } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, isAuth } = useAuth();
  const [wishlist, setWishlist] = useState(user?.wishlist || []);

  const toggle = async (productId) => {
    if (!isAuth) { toast.error('Please login to use wishlist'); return; }
    try {
      const { data } = await api.put(`/products/${productId}/wishlist`);
      setWishlist(data.wishlist);
      const isAdded = data.wishlist.includes(productId);
      toast.success(isAdded ? '❤️ Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const isWishlisted = (id) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
