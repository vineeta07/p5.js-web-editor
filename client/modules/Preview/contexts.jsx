import React, { createContext, useRef, useContext } from 'react';
import PropTypes from 'prop-types';

const CoordinatesContext = createContext();

export const useCoordinates = () => useContext(CoordinatesContext);

export const CoordinatesProvider = ({ children }) => {
  const coordinatesRef = useRef({});

  const updateCoordinates = (newCoordinates) => {
    coordinatesRef.current = newCoordinates;
  };

  return (
    <CoordinatesContext.Provider value={{ coordinatesRef, updateCoordinates }}>
      {children}
    </CoordinatesContext.Provider>
  );
};

CoordinatesProvider.propTypes = {
  children: PropTypes.node.isRequired
};
