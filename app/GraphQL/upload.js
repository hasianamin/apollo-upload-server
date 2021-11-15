const { gql } = require("apollo-server-express");
const {
  GraphQLUpload,
  graphqlUploadExpress // A Koa implementation is also exported.
} = require("graphql-upload");
const path = require('path')
const fs = require('fs')

const images = [
    {
        id: 1,
        path: 'http://localhost:8000/images/magic.png'
    }
]

const typeDefs = gql`
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  type File {
    url: String!
    filename: String
    mimetype: String
    encoding: String
  }

  type Images {
    id: Int!
    path: String!
  }

  type Query {
    # This is only here to satisfy the requirement that at least one
    # field be present within the 'Query' type.  This example does not
    # demonstrate how to fetch uploads back.
    otherFields: Boolean!
    getAllImages: [Images]!
  }

  type Mutation {
    # Multiple uploads are supported. See graphql-upload docs for details.
    uploadFile(file: Upload!): File!
  }
`;

const resolvers = {
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.
  Upload: GraphQLUpload,

  Mutation: {
    uploadFile: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const stream = createReadStream();
      const pathName = path.join(__dirname, `./../../public/images/${filename}`)
      await stream.pipe(fs.createWriteStream(pathName))
      
      return { url: `http://localhost:8000/images/${filename}`, mimetype, encoding };
    }
  },

  Query: {
    getAllImages() {
      return images
    }
  }
};

module.exports = {
    typeDefs,
    resolvers
}