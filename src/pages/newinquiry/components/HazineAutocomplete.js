/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useQuery } from '@apollo/client'; 
import {GET_ALL_BIMESHAVANDE_HAZINES } from '../NewInquiryQueriesMutations';
import Link from '@material-ui/core/Link';
export default function HazineAutocomplete(props) {
  const {handleChange,value, id ,giveGharardad} = props
  const { loading, error, data } = useQuery(GET_ALL_BIMESHAVANDE_HAZINES,{
      variables:{id: id},
      fetchPolicy: "network-only"
  });
  const changeValue = (value)=>
  {
    if (typeof value =='string')
    {
      value = data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.bimeshavandegharardadhazineSet.edges.find(function(node,index){
        if(node.node.hazine.id == value)
        {
          return node;
        }
      });
    }
    return value;
  }
  if (loading) return (<>'Loading...'</>);
  if (error) return (<>`Error! ${error.message}`</>);
  return (
    data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node &&
    <div style={{ width: 300 }}>
        <Link target="_blank" href={data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.gharardad.file  } color="primary">
        {data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.gharardad.name +'-'+ data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.gharardad.code}
  </Link>
      {giveGharardad? giveGharardad(data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.gharardad.id): null}
      <Autocomplete
        id="hazine"
        autoComplete
        options={data.bimeshanavde.bimeshavanadegharardadSet.edges[0].node.bimeshavandegharardadhazineSet.edges}
        value={changeValue(value)}
        onChange={handleChange}
        getOptionLabel={(option) => option.node.hazine.name +' ' + option.node.hazine.code}
        renderInput={(params) => (
          <TextField {...params} label="هزینه" margin="normal" variant="outlined" />
        )}
      />
    </div>
  );
}
