import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import css from './Modal.module.css';

const Modal = ({ imageUrl, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = ({ keyCode }) => {
      if (keyCode === 27) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={css.overlay} onClick={handleClick}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {isLoading && <Loader />}
        <img src={imageUrl} alt="" onLoad={handleImageLoad} />
      </div>
    </div>
  );
};

Modal.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
