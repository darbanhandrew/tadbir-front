import gql from 'graphql-tag';

export const GET_ALL_BIMESHAVANDES=gql`query getAllBimeshavandes {
    allBimeshavandes {
      edges {
        node {
          id
          melliCode
          firstName
          lastName
        }
      }
    }
  }
`;
export const GET_ALL_BIMESHAVANDE_HAZINES = gql`
query getBimeshavandeHazines($id:ID!)
{
  bimeshanavde(id:$id)
  {
    bimeshavanadegharardadSet
    {
      edges
      {
        node
        {
          gharardad
          {
            name
            id
            code
            file
          }
          bimeshavandegharardadhazineSet
          {
            edges
            {
              node
              {
                hazine{
                  name
                  id
                  code
                }
              }
            }
          }
        }
      }
    }
  }
}`
export const GET_BIMESHAVANDE_GHARARDAD = gql`
query getBimeshavandeGharardad($id:ID!)
{
  bimeshanavde(id:$id)
  {
    bimeshavanadegharardadSet
    {
      edges
      {
        node
        {
          gharardad
          {
            name
            id
            expireDate
          }
        }
      }
    }
  }
}`
export const UPLOAD_TEST= gql`
mutation uploadTest($files:Upload)
{
  uploadTestMutation(files:$files)
  {
    status
  }
}`;

export const PAZIRESH_MUTATION = gql`
mutation CreatePazireshMutation($bimeShavande:ID,$date:String,$files:Upload,$gharardad:ID,$hazine:ID,$hazineDarkhasti:Int,$markazDarmani:String,$shomareNezamPezeshki:String)
{
  createPazireshMutation(bimeShavande:$bimeShavande,date:$date,files:$files,gharardad:$gharardad,hazine:$hazine,hazineDarkhasti:$hazineDarkhasti,markazDarmani:$markazDarmani,shomareNezamPezeshki:$shomareNezamPezeshki)
  {
    paziresh
    {
      id
    }
  }
}`;