require('dotenv').config()
const express = require('express');
const graphqlHTTP = require('express-graphql');
var cors = require('cors')
const app = express();
const {google} = require('googleapis');

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
  console.log(items);
  data = items.map((value, i) => {
    let o = {
      videoID:value["id"]["videoID"]
    }
    return o;
  });
}

const idFieldsType = new GraphQLObjectType({
  name: 'idFields',
  fields: () => ({
    videoID: { type: GraphQLString }
  })
});

const videoType = new GraphQLObjectType({
  name: 'video',
  fields: {
   id: {type:idFieldsType}
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

getVideos()

app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(4000);