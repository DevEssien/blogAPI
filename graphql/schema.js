const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Post {
        title: String!
        imageUrl: String!
        content: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    type User {
        _id: ID!
        email: String!
        password: String
        name: String!
        status: String!
        post: [Post!]!
    }
    input UserInputData {
        email: String!
        name: String!
        password: String!
    }
    type RootMutation {
        createUser(userInput: UserInputData!): User!
    }
    type RootQuery {
        hello: String
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
