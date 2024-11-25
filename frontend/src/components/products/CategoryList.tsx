import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryListProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  selectedCategory?: string;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>Categories</Typography>
      <List>
        {categories.map((category) => (
          <ListItem
            button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            selected={selectedCategory === category.id}
          >
            <ListItemText 
              primary={category.name}
              secondary={`${category.count} items`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CategoryList;