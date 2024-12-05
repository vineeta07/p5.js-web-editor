import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { remSize } from '../../theme';

const CoordContainer = styled.div`
  z-index: 1000;
  padding: ${remSize(0.1)};
  border-bottom: ${remSize(1)} dashed #a6a6a6;
  margin-bottom: ${remSize(4)};

  p {
    font-size: ${remSize(9.5)};
    padding: 0 0 ${remSize(3.5)} ${remSize(3.5)};
    margin: 0;
    font-family: Inconsolata, monospace;
    font-weight: light;
    color: ${(props) => props.theme.Button.primary.default.foreground};
  }
`;

const CoordinateTracker = (isPlaying) => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let isListenerAttached = false;

    const waitForCanvas = () => {
      const iFrame = document.getElementById('previewIframe0');
      const canvas = iFrame.contentWindow.document.getElementById(
        'defaultCanvas0'
      );

      if (canvas && !isListenerAttached) {
        isListenerAttached = true;

        const mouseMoveHandler = (event) => {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          setCoordinates({ x, y });
        };

        canvas.addEventListener('mousemove', mouseMoveHandler);

        const observer = new MutationObserver(() => {
          if (!document.body.contains(canvas)) {
            canvas.removeEventListener('mousemove', mouseMoveHandler);
            observer.disconnect();
            isListenerAttached = false;
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });
      } else if (!canvas) {
        setTimeout(waitForCanvas, 500);
      }
    };

    waitForCanvas();
  }, [isPlaying]);

  return (
    <CoordContainer>
      <p>
        Mouse X: {isPlaying ? coordinates.x : 0} Mouse Y:{' '}
        {isPlaying ? coordinates.y : 0}
      </p>
    </CoordContainer>
  );
};

export default CoordinateTracker;
