/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useQuery } from '@apollo/client'; 
import { GET_ALL_BIMESHAVANDES } from '../NewInquiryQueriesMutations';
export default function BimeshavandeAutocomplete(props){
  const {handleChange,value} = props
  const { loading, error, data } = useQuery(GET_ALL_BIMESHAVANDES,{
    fetchPolicy: "network-only"
  });
  if (loading) return (<>'Loading...'</>);
  if (error) return (<>`Error! ${error.message}`</>);
  return (
    data.allBimeshavandes && data.allBimeshavandes.edges &&

    <div style={{ width: 300 }}>
      <Autocomplete
        id="bimeshavande"
        autoComplete
        value={value}
        onChange={handleChange}
        options={data.allBimeshavandes.edges}
        getOptionLabel={(option) => option.node.firstName +' '+option.node.lastName + ' ' + option.node.melliCode}
        renderInput={(params) => (
          <TextField {...params} label="کد ملی" margin="normal" variant="outlined" />
        )}
      />
    </div>
   
  );
}
