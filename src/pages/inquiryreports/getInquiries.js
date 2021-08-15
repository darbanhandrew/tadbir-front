import gql from 'graphql-tag';

export const GET_PAZIRESHES_FOR_TABLE = gql`
query getAllPazireshesForTable($first:Int,$offset:Int)
{
  allPazireshes(first:$first,offset:$offset)
  {
    totalCount
    edges
    {
      node
      {
        id
        hazineDarkhasti
        status
        file
        date
        bimeshavandeGharardadHazine{
          bimeshavandeGharardad{
            bimeshavande
            {
              melliCode
              firstName
              lastName
            }
          }
          hazine
          {
            name
          }
        }
      }
    }
  }
}`;
export const GET_PAZIRESH_FOR_MODAL = gql`query getAllPazireshesForModal($id: ID!) {
  paziresh(id: $id) {
    id
    hazineDarkhasti
    hazineTaeidi
    status
    file
    date
    bimePaye
    arzyabMessage
    bimeshavandeGharardadHazine {
      personalSaghf
      bimeshavandeGharardad {
        gharardad {
          name
          code
          file
        }
        bimeshavande {
          melliCode
          firstName
          lastName
          id
        }
      }
      hazine {
        name
        id
        code
      }
    }
  }
}
`;
export const EDIT_PAZIRESH_MUTATION = gql`mutation EditPazireshMutation($arzyabMessage:String,$bimePaye:Boolean,$hazine:ID,$hazineDarkhasti:Int,$hazineTaeidi:Int,$id:ID,$profileId:ID,$profileType:String,$status:Boolean){
  editPazireshMutation(arzyabMessage:$arzyabMessage,bimePaye:$bimePaye,hazine:$hazine,hazineDarkhasti:$hazineDarkhasti,hazineTaeidi:$hazineTaeidi,id:$id,profileId:$profileId,profileType:$profileType,status:$status){
    success
    paziresh
    {
      id
    }
  }
}`;