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

    type AuthData {
        token: String!
        userId: String!
    }
    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData!): User!
        createPost(postInput: PostInputData!): Post!
    }

    type RootQuery {
        login(email: String! password: String!): AuthData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
