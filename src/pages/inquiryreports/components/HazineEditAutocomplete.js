/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useQuery } from '@apollo/client'; 
import {GET_ALL_BIMESHAVANDE_HAZINES } from 'pages/newinquiry/NewInquiryQueriesMutations';
export default function HazineEditAutocomplete(props) {
  const {handleChange,value, id ,giveGharardad} = props
  const { loading, error, data } = useQuery(GET_ALL_BIMESHAVANDE_HAZINES,{
      variables:{id: id}
  });
  if (loading) return (<>'Loading...'</>);
  if (error) return (<>`Error! ${error.message}`</>);
  return (
    data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node &&
    <div style={{ width: 300 }}>
      <TextField disabled defaultValue={data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.gharardad.name +'-'+ data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.gharardad.code} id="gharardad"/>
      {giveGharardad? giveGharardad(data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.gharardad.id): null}
      <Autocomplete
        id="hazine"
        autoComplete
        value={value}
        onChange={handleChange}
        options={data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.bimeshavandegharardadhazineSet.edges}
        getOptionLabel={(option) => option.node.hazine.name +' ' + option.node.hazine.code}
        renderInput={(params) => (
          <TextField {...params} label="هزینه" margin="normal" variant="outlined" />
        )}
      />
    </div>
  );
}
