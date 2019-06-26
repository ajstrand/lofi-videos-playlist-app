import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import styled from "styled-components";
import axios from "axios";
const Grid = styled.div`
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));;
  grid-template-rows: 250px 1fr 1fr;
`
const Cell = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  grid-row-start:${props => props.row ? props.row : "1"};
  grid-column-start:2;
  marginBottom:15px;
`;

const VideoWrapper = styled(Cell)`
    overflow: hidden;
    position: relative;
    padding-top:25px;
    padding-bottom:56.25%;
    height: 0px;
    flex-basis:500px;
`;

const ResponsiveIframe = styled(YouTube)`
    position: absolute;
	  top: 0;
    left: 0;
    width: 100%;
	  height: 100%;
`;

const Text = styled.p`
    color:#eeeeee;
    margin-top:15px;
`;

const StyledButton = styled.button`
  padding:15px;
  cursor:pointer;
  margin-top:30px;
  font-size:20px;
  border:none;
  background-color:#00adb5;
  color:#eeeeee;
`;

const GET_DATA = `
  {
    videos {
      videoID
      title
    }
  }
`;

const axiosGraphQLQuery = axios.create({
  baseURL: '/api/graphql'
});

function App() {
  const [errors, setErrors] = useState(null);
  const [height, setHeight] = useState('390px');
  const [width, setWidth] = useState('640px');
  const [videoList, setVideoList] = useState([]);
  const [title, setTitle] = useState(null);
  const [videoID, setVideoID] = useState(null);
  const opts = {
    host: `${window.location.protocol}//www.youtube.com`,
    height: height,
    width: width,
    playerVars: {
      autoplay: 0
    }
  }

  useEffect(() => {
    if (videoList.length === 0) {
      axiosGraphQLQuery
        .post('', { query: GET_DATA })
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
            setErrors(<Text>no videos returned or another error occurred</Text>)
            throw new Error("no videos returned or another error occurred")
          }
        }).catch(function (error) {
          console.error(error)
          let serverErrors = errors !== null && errors !== undefined ? Array.isArray(errors) ? errors.map((value, i) => {
            let message = value.message;
            return <Text tabIndex={0} key={`${message}-${i}`}>{message}</Text>
          }) : <Text tabIndex={0} >{errors.message}</Text> : null
          setErrors(serverErrors)
          throw new Error("server error occurred")
        });
    }
  });

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
