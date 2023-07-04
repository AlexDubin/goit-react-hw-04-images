import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import css from './app.module.css';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const API_KEY = '37930503-8d8d6a4cdb4ba6645e7575bb7';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
    setError(null);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setModalImageUrl('');
  };

  useEffect(() => {
    const fetchImages = async () => {
      if (!query) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(BASE_URL, {
          params: {
            q: query,
            page,
          },
        });

        if (response.data.hits.length === 0) {
          throw new Error(`No images for "${query}".`);
        }

        setImages((prevImages) => [...prevImages, ...response.data.hits]);
        setTotalPages(Math.ceil(response.data.totalHits / 12));
      } catch (error) {
        console.error('Error fetching images:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [query, page]);

  return (
    <div className={css.container}>
      <Searchbar onSubmit={handleSearch} />

      {error ? (
        <p>{error}</p>
      ) : (
        <ImageGallery images={images} onItemClick={handleImageClick} />
      )}

      {isLoading && <Loader />}

      {!isLoading && images.length > 0 && page < totalPages && (
        <Button onClick={handleLoadMore} />
      )}

      {modalImageUrl && <Modal imageUrl={modalImageUrl} onClose={handleCloseModal} />}
    </div>
  );
};

App.propTypes = {
  images: PropTypes.array,
  isLoading: PropTypes.bool,
  modalImageUrl: PropTypes.string,
  error: PropTypes.string,
};

export default App;
