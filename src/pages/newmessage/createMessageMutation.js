import gql from 'graphql-tag';

export const createMessageMutation = gql`
mutation createMessage($input:CreateMessageMutationInput!)
{
  createMessage(input:$input){
    message{
      id
    }
  }
}`;