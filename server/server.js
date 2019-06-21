require('dotenv').config()
const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors')
const { google } = require('googleapis');
const redis = require("redis");

const client = redis.createClient();
const app = express();



client.on("error", function (err) {
  console.log("Error " + err);
});

//TODO: patch this out before deploy to prod
/*client.flushall('ASYNC', () => {
  console.log("cleared")
});*/

client.lrange("videoData", 0, -1, (error, data) => {
  if (error || data === null || data === undefined || data.length === 0) {
    console.log(error)
    getVideos()
    console.log("requesting api data")
  }
  else {
    console.log(JSON.parse(data));
    console.log("got data from redis instead")
  }
})

const {
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

let data = [];
async function getVideos() {
  const res = await youtube.search.list({
    part: 'snippet',
    q: 'lofi hiphop',
  });
  let items = res.data.items;
  data = items.map((value, i) => {
    let videoDataObject = {
      videoID: value.id.videoId
    }
    return videoDataObject;
  });
  console.log(data)
  client.rpush(["videoData", JSON.stringify(data)]);
}

const videoType = new GraphQLObjectType({
  name: 'video',
  fields: {
    videoID: { type: GraphQLString }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      videos: {
        type: GraphQLList(videoType),
        resolve() {
          return data;
        }
      }
    }
  })
});

app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(4000);