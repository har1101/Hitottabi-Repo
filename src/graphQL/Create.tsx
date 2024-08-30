import { gql } from 'graphql-tag'

export const CREATE_ITEM_QUERY =  gql`
    mutation MyMutation {
        invokeAgent(message: "お前の名前は？") {
            statusCode
            body
        }
    }
`;

// export const CREATE_ITEM_QUERY = gql`
//     mutation MyMutation($message: String!) {
//         invokeAgent(message: $message) {
//             statusCode
//             body
//         }
//     }
// `;