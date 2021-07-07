import { gql } from '@apollo/client';

const GET_ALL_PROFILES = gql`
query ListProfiles
{
  allProfile
  {
    edges
    {
      node
      {
        id
		phoneNumber
      }
    }
  }
}`;

export default GET_ALL_PROFILES;