import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Grid, Cell, Text, ResponsiveIframe, StyledButton, VideoWrapper } from './styledComponents/appComponents';
const GET_DATA = `
  {
    videos {
      videoID
      title
    }
  }
`;

function App() {
  const [errors, setErrors] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [title, setTitle] = useState(null);
  const [videoID, setVideoID] = useState(null);
  const opts = {
    host: `${window.location.protocol}//www.youtube.com`,
    height: '390px',
    width: '640px',
    playerVars: {
      autoplay: 0
    }
  }

  useEffect(() => {
    if (videoList.length === 0) {
      const graphQL_URL = '/api/graphql';
      axios
        .post(graphQL_URL, { query: GET_DATA })
        .then(result => {
          let videos = result.data.data.videos;
          if (videos.length !== 0) {
            setVideoList(videos);
            let randomVideoNumber = Math.floor(Math.random() * Math.floor(videos.length - 1));
            if (videos[randomVideoNumber] &&
              videos[randomVideoNumber].videoID !== undefined &&
              videos[randomVideoNumber] !== null) {
              setVideoID(videos[randomVideoNumber].videoID)
              setTitle(videos[randomVideoNumber].title)
            }
          }
          else {
            handleErrors("no videos returned from server");

          }
        }).catch((error) => {
          handleErrors(error);
        });
    }
  }, []);

  const handleErrors = (errors) => {
    console.error(errors)
    let serverErrors = errors !== null && errors !== undefined ? Array.isArray(errors) ? errors.map((value, i) => {
      let message = value.message;
      return <Text tabIndex={0} key={`${message}-${i}`}>{message}</Text>
    }) : <Text tabIndex={0} >{errors.message ? errors.message : errors}</Text> : null
    setErrors(serverErrors)
    throw new Error("server error occurred")
  }

  // access to player in all event handlers via event.target
  const _onReady = (event) => {
    event.target.pauseVideo();
  }

  const switchVideo = () => {
    let randomVideoNumber = Math.floor(Math.random() * Math.floor(videoList.length - 1));
    setVideoID(videoList[randomVideoNumber].videoID);
    setTitle(videoList[randomVideoNumber].title)
  }

  const render = videoList.length !== 0 && errors === null && videoID ? <VideoWrapper row={2}>
    <ResponsiveIframe
      videoId={videoID}
      opts={opts}
      onReady={() => _onReady}
    />
  </VideoWrapper> :
    <Cell row={2}>
      {errors}
    </Cell>

  return (
    <Grid>
      <Cell row={1}>
        <Text tabIndex={0}>Stream lofi hiphop videos for studying/work/etc.</Text>
        <Text tabIndex={0}>Click the button the video to get another video.</Text>
        {title ? <Text tabIndex={0}>title: {title}</Text> : null}
      </Cell>
      {render}
      <Cell row={3}>
        <StyledButton disabled={errors !== null && errors !== undefined} onClick={() => switchVideo()}>Watch Another Video</StyledButton>
      </Cell>
    </Grid>
  );
}

export default App;
