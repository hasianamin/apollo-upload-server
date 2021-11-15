const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const {
  GraphQLUpload,
  graphqlUploadExpress // A Koa implementation is also exported.
} = require("graphql-upload");
const {buildSubgraphSchema} = require('@apollo/subgraph')
const path = require('path')
const Upload = require('./GraphQL/upload')

async function startServer() {
  // const server = new ApolloServer(
  //   Upload
  // );

  const server = new ApolloServer({
    schema: buildSubgraphSchema([Upload])
  });

  await server.start();

  const app = express();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

  app.use(express.static(path.resolve('./public')))

  server.applyMiddleware({ app });



  await new Promise(r => app.listen({ port: 8000 }, r));

  console.log(`🚀 Server ready at http://localhost:8000${server.graphqlPath}`);
}

startServer();