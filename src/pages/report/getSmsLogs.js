import gql from 'graphql-tag';

export const GET_SMS_LOGS = gql`
query GetSmsLogs {
  allSmsLogs {
    edges
    {
      node
      {
        id
        message
        {
          receiver{
            name
            phoneNumber
            category
          }
          file
        }
        codeMessage
        updatedAt
      }
    }
  }
}`;