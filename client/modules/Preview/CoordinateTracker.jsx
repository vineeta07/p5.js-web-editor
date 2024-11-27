import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCoordinates } from './contexts';
import { remSize } from '../../theme';

const CoordContainer = styled.div`
  // font-size: 1rem;
  color: ${(props) => props.theme.primaryTextColor};
  z-index: 1000;
  // font-size: ${remSize(1)};
  padding: ${remSize(0.1)};
`;

const CoordinateTracker = () => {
  const { coordinatesRef } = useCoordinates();
  const [coordinates, setCoordinates] = useState(coordinatesRef.current);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoordinates({ ...coordinatesRef.current });
    }, 100);

    return () => clearInterval(interval);
  }, [coordinatesRef]);

  return (
    <CoordContainer>
      <p>
        X: {coordinates?.xVal || 0} Y: {coordinates?.yVal || 0}
      </p>
    </CoordContainer>
  );
};

export default CoordinateTracker;
