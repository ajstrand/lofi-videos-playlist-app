import React, { Fragment, useState, useEffect } from 'react';
import MDSpinner from "react-md-spinner";
import {
  Cell,
  Text,
  ResponsiveIframe,
  VideoWrapper,
} from './styledComponents/appComponents';

const VideoSection = (props) => {
  const { videoList, errors, videoID, middleCellProps, isLoading } = props;
  const [localID, setLocalVideoID] = useState(videoID)
  const opts = {
    host: `${window.location.protocol}//www.youtube.com`,
    height: '390px',
    width: '640px',
    playerVars: {
      autoplay: 0
    }
  }
  useEffect(() => {
    //alert(localID)
    setLocalVideoID(videoID)
  }, [videoID])
  const middleContent = () => {
    let content = videoList.length !== 0 && errors === null && videoID ?
      <VideoWrapper>
        <ResponsiveIframe
          videoId={localID}
          // videoId={"2g811Eo7K8U"}
          opts={opts}
          onReady={_onReady}
        />
      </VideoWrapper> :
      errors;

    return content;

  }


  // access to player in all event handlers via event.target
  const _onReady = (event) => {
    event.target.pauseVideo();
  }

  return (
    <Cell aria-live="polite" aria-atomic="true" {...middleCellProps} row={2}>
      {!isLoading ? middleContent() :
        <Fragment>
          <MDSpinner />
          <Text>Currently loading videos. They should be available shortly. </Text>
        </Fragment>
      }
    </Cell>
  )
}


function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default VideoSection;