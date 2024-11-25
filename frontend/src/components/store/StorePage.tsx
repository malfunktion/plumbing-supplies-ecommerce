import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import CategoryList from '../products/CategoryList';
import ProductGrid from '../products/ProductGrid';
import { IProduct } from '@/types/product';

const StorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [products] = useState<IProduct[]>([
    {
      id: '1',
      name: 'Premium Faucet',
      description: 'High-quality kitchen faucet with modern design',
      price: 129.99,
      stock: 10,
      category: 'faucets',
      imageUrl: '/images/faucet.jpg'
    },
    // Add more sample products here
  ]);

  const categories = [
    { id: 'faucets', name: 'Faucets', count: 5 },
    { id: 'pipes', name: 'Pipes', count: 8 },
    { id: 'valves', name: 'Valves', count: 3 },
  ];

  const handleAddToCart = (productId: string) => {
    console.log('Adding to cart:', productId);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Box sx={{ position: 'sticky', top: 20 }}>
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={9}>
        <ProductGrid
          products={products.filter(p => !selectedCategory || p.category === selectedCategory)}
          onAddToCart={handleAddToCart}
        />
      </Grid>
    </Grid>
  );
};

export default StorePage;
