import React, { useState, useEffect } from 'react';
import axios from "axios";
import Bottom from "./Bottom";
import Footer from "./Footer";
import Header from "./Header";
import VideoSection from "./VideoSection";
import {
  Grid,
  Text,
} from './styledComponents/appComponents';
const GET_DATA = `
  {
    videos {
      videoID
      title
    }
  }
`;

function App() {
  const [isLoading, setLoading] = useState(false);
  const [middleCellProps, setMiddleCellProps] = useState(
    { flex: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }
  );
  const [errors, setErrors] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [title, setTitle] = useState(null);
  const [videoID, setVideoID] = useState(null);

  useEffect(() => {
    if (videoList.length === 0) {
      setLoading(true);
      const graphQL_URL = '/api/graphql';
      axios
        .post(graphQL_URL, { query: GET_DATA })
        .then(result => {
          setLoading(false);
          let videos = result.data.data.videos;
          if (videos.length !== 0) {
            setVideoList(videos);
            let randomVideoNumber = Math.floor(Math.random() * Math.floor(videos.length - 1));
            if (videos[randomVideoNumber] &&
              videos[randomVideoNumber].videoID !== undefined &&
              videos[randomVideoNumber] !== null) {
              setMiddleCellProps({})
              setVideoID(videos[randomVideoNumber].videoID)
              setTitle(videos[randomVideoNumber].title)
            }
          }
          else {
            handleErrors("no videos returned from server");
          }
        }).catch((error) => {
          setLoading(false);
          handleErrors(error);
        });
    }
  }, []);

  const handleErrors = (errors) => {
    const genericMessage = `Your wifi/internet connection may be down. 
    Make sure you are connected to the internet or data to view videos.`;
    console.error(errors)
    let serverErrors = errors !== null && errors !== undefined ? Array.isArray(errors) ? errors.map((value, i) => {
      let message = value.message;
      return <Text tabIndex={0} key={`${message}-${i}`}>{message}. {genericMessage}</Text>
    }) : <Text role={"alert"} tabIndex={0} >{errors.message ? errors.message : errors}. {genericMessage}</Text> : null
    setErrors(serverErrors)
    throw new Error("server error occurred")
  }

  const switchVideo = () => {
    let randomVideoNumber = Math.floor(Math.random() * Math.floor(videoList.length - 1));
    setVideoID(videoList[randomVideoNumber].videoID);
    setTitle(videoList[randomVideoNumber].title)
  }

  return (
    <Grid>
      <Header title={title} />
      <VideoSection
        isLoading={isLoading}
        videoID={videoID}
        middleCellProps={middleCellProps}
        errors={errors}
        videoList={videoList}
      />
      <Bottom isLoading={isLoading} errors={errors} switchVideoCallback={() => switchVideo()} />
      <Footer/>
    </Grid>
  );
}

export default App;
