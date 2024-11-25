import React, { useReducer, useState, useEffect } from 'react';
import { render } from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import {
  registerFrame,
  listen,
  MessageTypes,
  dispatchMessage
} from '../../utils/dispatcher';
import { filesReducer, setFiles } from './filesReducer';
import EmbedFrame from './EmbedFrame';
import getConfig from '../../utils/getConfig';
import { initialState } from '../IDE/reducers/files';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

// editor, nested iframe - intermediary for iframe and editor itself handling preview, nested iframe that is just the rendering
// previewentry is just the inner rendering, catching all the console messages from the sketch that's running
// outer iframe is capturing those and sending it back to the editor, is like this for security reasons, need the sketch to be running in an sandboxed iframe so it can't access
// preview entry is on the innermost iframe
// preview index is handling the rendering and all the messaging back and forth, rendering is done by PreviewEmbedFrame
// embedFrame is assmebling all the html together and creates a frame that is setting the source, renderSketch() is most important
// blobUrl is like a web url but lets you do and store that in the browser memory
// intermediate iframe is routing all messages from the editor and dispatching the messages that is seting the files, when that is set it re-renders
// what i want is a component on the midIframe, which is all running on the previewIndex
// back in previewIndex, will post the message for toggling preferences

// actions, IDE after hitting play startSketch, startSketch action dispatchesMessage

// previewIndex, add a new state (can you see coordinates or net, set coordinates)
// will also have state in base editor itself, and in preferences actions file, you'll have to create new function that dispatches a message similar to startSketch, where it dispatches and updates the internal state of the editor (266 - 268 is sending info to previewIndex.jsx)
// in previewIndex, there is code handling receiving that message, will need to add a new messagetype to dispatcher and set the state of setCoordinatesVisible, state passed as paramter to component that will render the mouse position
// dispatcher file is what's handling sending all the messages back and forth, can use it in the editor window and preview iframe

// dispatcher sets up an eventlistener that listens for message events
// create a new component in preview folder, add eventlistenere for hovermousemove, put that in this component so we can use React stuff, then in that component reference the editorframe by using window.parent, whereas in
// have a ref to the editor frame (i.e window.parent -  two nested iframes in rendering of the editor)
const App = () => {
  const [state, dispatch] = useReducer(filesReducer, [], initialState);
  const [isPlaying, setIsPlaying] = useState(false);
  const [basePath, setBasePath] = useState('');
  const [textOutput, setTextOutput] = useState(false);
  const [gridOutput, setGridOutput] = useState(false);
  registerFrame(window.parent, getConfig('EDITOR_URL'));

  function handleMessageEvent(message) {
    const { type, payload } = message;
    switch (type) {
      case MessageTypes.SKETCH:
        dispatch(setFiles(payload.files));
        setBasePath(payload.basePath);
        setTextOutput(payload.textOutput);
        setGridOutput(payload.gridOutput);
        break;
      case MessageTypes.START:
        setIsPlaying(true);
        break;
      case MessageTypes.STOP:
        setIsPlaying(false);
        break;
      case MessageTypes.REGISTER:
        dispatchMessage({ type: MessageTypes.REGISTER });
        break;
      case MessageTypes.EXECUTE:
        dispatchMessage(payload);
        break;
      default:
        break;
    }
  }

  function addCacheBustingToAssets(files) {
    const timestamp = new Date().getTime();
    return files.map((file) => {
      if (file.url && !file.url.endsWith('obj') && !file.url.endsWith('stl')) {
        return {
          ...file,
          url: `${file.url}?v=${timestamp}`
        };
      }
      return file;
    });
  }

  useEffect(() => {
    const unsubscribe = listen(handleMessageEvent);
    return function cleanup() {
      unsubscribe();
    };
  });
  return (
    <React.Fragment>
      <GlobalStyle />
      <EmbedFrame
        files={addCacheBustingToAssets(state)}
        isPlaying={isPlaying}
        basePath={basePath}
        gridOutput={gridOutput}
        textOutput={textOutput}
      />
    </React.Fragment>
  );
};

render(<App />, document.getElementById('root'));
