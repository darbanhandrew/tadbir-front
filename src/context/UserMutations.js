import gql from 'graphql-tag';

export const LOGIN_MUTATION = gql`mutation login($username:String!,$password:String!)
{
  tokenAuth(username:$username,password:$password)
  {
    token
    user {
      id
      karshenas{
        id
        firstName
        lastName
      }
      bimeshavande{
        id
        firstName
        lastName
      }
      arzyab{
        id
        firstName
        lastName
      }
    }
    payload
  }
}`;