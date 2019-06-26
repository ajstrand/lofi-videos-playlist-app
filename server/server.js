require('dotenv').config()
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { google } = require('googleapis');
const redis = require("redis");
const {
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');
const helmet = require('helmet');
const path = require('path');

const client = redis.createClient();
const app = express();

let graphQLQueryData = [];




client.on("error", function (err) {
  console.log("Error " + err);
});


let clear = process.argv[2]

if(clear && clear === "clear"){
  client.flushall('ASYNC', () => {
    console.log("redis cache cleared")
  });
}

client.lrange("videoData", 0, -1, (error, data) => {
  if (error || data === null || data === undefined || data.length === 0) {
    console.log(error)
    getVideos()
    console.log("requesting api data")
  }
  else {
    console.log("got data from redis instead")
    graphQLQueryData = JSON.parse(data);
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


async function getVideos() {
  const random = Math.floor(Math.random() * Math.floor(searchTerms.length - 1));
  const randomSearchTerm = searchTerms[random];
  try {
    const res = await youtube.search.list({
      part: 'snippet',
      q: randomSearchTerm,
      maxResults: 25,
    });
    graphQLQueryData = res.data.items
      .filter((jsonObj) => jsonObj.id.videoId !== null && jsonObj.id.videoId !== undefined)
      .map(obj => {
        return {
          title: obj.snippet.title,
          videoID: obj.id.videoId
        }
      });
    const jsonData = JSON.stringify(graphQLQueryData);
    client.rpush(["videoData", jsonData]);
    console.log("got data from the API");
  } catch(error) {
    console.error(`an error occurred trying to fetch data ${error}`)
  }
}

const videoType = new GraphQLObjectType({
  name: 'video',
  fields: {
    videoID: { type: GraphQLString },
    title: { type: GraphQLString }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      videos: {
        type: GraphQLList(videoType),
        resolve() {
          return graphQLQueryData;
        }
      }
    }
  })
});

app.use(helmet());

app.use(express.static(path.join(__dirname, '../build')));

app.get('/api/test', (req, res) => {
  const hello = "hello from the server, this is a test";
  res.send(JSON.stringify(hello));
})

app.post('/api/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

const port = 4000;

app.listen(port);
console.log(`server running on port ${port}`);