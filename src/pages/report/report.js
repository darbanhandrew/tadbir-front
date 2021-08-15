import { useQuery } from '@apollo/client';
import { forwardRef } from 'react';
import React from 'react';
import { GET_SMS_LOGS } from './getSmsLogs';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };
export default function Report() {
    const { loading, error, data } = useQuery(GET_SMS_LOGS);
    const tableData = {
        columns: [],
        rows: []
    }
    tableData.columns = [
        { field: 'id', title: 'شناسه' },
        { field: 'name', title: "نام" },
        { field: 'phonenumber', title: "شماره تلفن" },
        { field: 'type', title: "نوع" },
        { field: 'file', title: "فایل",render: rowData =><a href={"https://genito.ir/media/"+rowData.file} target="_blank">مشاهده فایل</a>

     },
        { field: 'codemessage', title: "جواب پیامک", width: 200 },
        { 
            field: 'updatedat', title: "زمان ارسال", width: 200,type: 'date'
            ,render: rowData =>new Date(rowData.updatedat).toLocaleTimeString('fa-IR')+ ' - ' +new Date(rowData.updatedat).toLocaleDateString('fa-IR')
     },
    ]
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;


    return (
        <div style={{ maxWidth: '100%' }}>
            {
                    tableData.rows = data.allSmsLogs.edges.map((node) => {
                        return {
                            id: node.node.id,
                            name: node.node.message.receiver.name,
                            phonenumber: node.node.message.receiver.phoneNumber,
                            type: node.node.message.receiver.category,
                            file: node.node.message.file,
                            codemessage: node.node.codeMessage,
                            updatedat: node.node.updatedAt,
                        }
                    }),
                    console.log(tableData.rows),

                    <MaterialTable
                      icons={tableIcons}
                      columns={tableData.columns}
                      data={tableData.rows}
                      title="Demo Title"
                    />
            }
                              </div>
    );
}