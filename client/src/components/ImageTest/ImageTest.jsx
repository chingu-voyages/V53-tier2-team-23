// for testing broken image links in the database only

import React, { useEffect, useState } from 'react';

const ImageTest = () => {
  const [dishes, setDishes] = useState([]);
  const [brokenImages, setBrokenImages] = useState([]);
  const token = localStorage.getItem('token');

  const getImageURL = (imageUrl) => {
    if (!imageUrl) {
      return 'https://placehold.it/400x300';
    }

    const imageBasePath = 'https://res.cloudinary.com/dspxn4ees/image/upload/';
    const imageName = imageUrl.replace('imagesPath/', '').replace('.jpg', '');
    const imageExt = '.jpg';
    const imageURL = `${imageBasePath}${imageName}${imageExt}`;
    return imageURL;
  };

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(
          'https://eato-meatplanner.netlify.app/.netlify/functions/dishes',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch dishes');
        }

        const data = await response.json();
        setDishes(data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchDishes();
  }, []);

  const handleImageError = (dish) => {
    setBrokenImages((prevBrokenImages) => [...prevBrokenImages, dish]);
  };

  return (
    <div className='image-test-container'>
      <div className='broken-images-list mt-8'>
        <h2 className='text-center text-primary font-bold text-[20px] mb-3'>
          Broken Image Links
        </h2>
        <ul>
          {brokenImages.map((dish) => (
            <li key={dish._id} className='text-black'>
              {dish.dishName}
            </li>
          ))}
        </ul>
      </div>
      <div className='dishes-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {dishes.map((dish) => (
          <div key={dish._id} className='dish-item p-4 border rounded-md'>
            <h2 className='dish-name text-lg font-bold text-black'>
              {dish.dishName}
            </h2>
            <img
              src={getImageURL(dish.imageUrl)}
              alt={dish.dishName}
              className='dish-image w-full h-auto mt-2 rounded-md'
              onError={() => handleImageError(dish)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest;
