require('dotenv').config()
const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors')
const { google } = require('googleapis');
const redis = require("redis");
const {
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

const client = redis.createClient();
const app = express();



client.on("error", function (err) {
  console.log("Error " + err);
});

//TODO: patch this out before deploy to prod
client.flushall('ASYNC', () => {
  console.log("cleared")
});

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

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const searchTerms = ['lofi hiphop playlist',
  'lofi study playlist',
  '/ lofi study playlist',
  '/ lofi hiphop playlist',
  "lofi hip hop mix",
  "lofi hiphop mix",
  "lofi work and chill playlist"];


let data = [];
async function getVideos() {
  const random = Math.floor(Math.random() * Math.floor(searchTerms.length - 1));
  const randomSearchTerm = searchTerms[random];
  const res = await youtube.search.list({
    part: 'snippet',
    q: randomSearchTerm,
    maxResults: 25,
  });
  data = res.data.items
    .filter((jsonObj) => jsonObj.id.videoId !== null && jsonObj.id.videoId !== undefined)
    .map(obj => {
      return {
        videoID: obj.id.videoId
      }
    });
  const jsonData = JSON.stringify(data);
  client.rpush(["videoData", jsonData]);
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