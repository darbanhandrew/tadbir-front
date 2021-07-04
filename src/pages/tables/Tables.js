import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MUIDataTable from "mui-datatables";
// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "../dashboard/components/Table/Table";
import GET_ALL_PROFILES from './AllProfilesQuery'
import {useQuery,NetworkStatus} from '@apollo/client'
// data
import mock from "../dashboard/mock";

const datatableData = [
];

const useStyles = makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
  }
}))

export default function Tables() {
  const classes = useStyles();
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_ALL_PROFILES,
    {
      notifyOnNetworkStatusChange: true,
    },
  );
  return (
    <>
      <PageTitle title="Tables" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {(!loading)?
            (
            data.allProfile.edges.map(({node})=>datatableData.push([node.id,node.phoneNumber])),
            console.log(datatableData),
            <MUIDataTable
            title="اسامی پروفایل"
            data={datatableData}
            columns={["اسم", "شرکت"]}
            options={{
              filterType: "checkbox",
            }}
          />):(<CircularProgress />) 
        },
        </Grid>
        <Grid item xs={12}>
          <Widget title="Material-UI Table" upperTitle noBodyPadding bodyClass={classes.tableOverflow}>
            <Table data={mock.table} />
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}
