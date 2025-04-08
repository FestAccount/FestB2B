import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const MenuCard = ({ item, onUpdate }) => {
  const handleEditClick = () => {
    // TODO: Implement edit functionality
    console.log('Edit clicked for item:', item);
  };

  return (
    <Card sx={{ position: 'relative', height: '100%' }}>
      {item.image_url && (
        <CardMedia
          component="img"
          height="200"
          image={item.image_url}
          alt={item.nom}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h3" color="primary">
            {item.nom}
          </Typography>
          <Typography variant="h6" component="span">
            {parseFloat(item.prix).toFixed(2)}€
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {item.description}
        </Typography>
      </CardContent>
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onClick={handleEditClick}
      >
        <EditIcon />
      </IconButton>
    </Card>
  );
};

export default MenuCard; 