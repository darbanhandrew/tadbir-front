import { useApolloClient, useQuery } from '@apollo/client';
import { forwardRef } from 'react';
import React from 'react';
import { GET_PAZIRESHES_FOR_TABLE } from './getInquiries';
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
import { AlternateEmailTwoTone } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import EditInquiryModal from './editInquiryModal';
import { CircularProgress } from '@material-ui/core';
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
export default function InquiryReports() {

    const client = useApolloClient();
    const tableData =
    {
        columns: [],
        rows: []
    }
    const statusArray = {
        WAITFORKARSHENAS: { name: "در انتظار کارشناس", order: 1 },
        WAITFORARZYAB: { name: "در انتظار ارزیاب", order: 2 },
        ACCEPTED: { name: "حواله پرداخت", order: 3 },
        REJECTED: { name: "عودت", order: 4 },
    }
    const [openModal, setOpenModal] = React.useState(false);
    const [chosenId, setChosenId] = React.useState(false);
    const [loading,setLoading] = React.useState(false);
    const [error,setError] = React.useState(false);
    const [pageSize,setPageSize] = React.useState(5);
    const [filters,setFilters] = React.useState(null);
    const convertStatus = (status) => {
        return statusArray[status].name
    }
    tableData.columns = [
        { field: 'id', title: 'شناسه' },
        { field: 'name', title: "نام" },
        { field: 'codeMelli', title: "کد ملی" },
        {
            field: 'status', title: "وضعیت", customSort: (a, b) => statusArray[a.status].order - statusArray[b.status].order,
            render: rowData => convertStatus(rowData.status),
            lookup: { WAITFORKARSHENAS: 'در انتظار کارشناس', WAITFORARZYAB: 'در انتظار ارزیاب',ACCEPTED:"حواله پرداخت",REJECTED:"عودت" },
        },
        { field: 'hazine', title: "هزینه" },
        { field: 'hazineDarkhasti', title: "هزینه درخواستی", width: 200 },
        {
            field: 'file', filtering: false, title: "فایل", render: rowData => <a href={rowData.file} target="_blank">مشاهده فایل</a>

        },
        {
            field: 'updatedat', filtering: false, title: "تاریخ پذیرش", width: 200, type: 'date'
            , render: rowData => new Date(rowData.updatedat).toLocaleDateString('fa-IR')
        },
    ]

    const handleCompleted = (data) => {
        if (data && data.allPazireshes) {
            return data.allPazireshes.edges.map((node) => {
                return {
                    id: node.node.id,
                    name: node.node.bimeshavandeGharardadHazine.bimeshavandeGharardad.bimeshavande.firstName + ' ' + node.node.bimeshavandeGharardadHazine.bimeshavandeGharardad.bimeshavande.lastName,
                    codeMelli: node.node.bimeshavandeGharardadHazine.bimeshavandeGharardad.bimeshavande.melliCode,
                    status: node.node.status,
                    hazine: node.node.bimeshavandeGharardadHazine.hazine.name,
                    hazineDarkhasti: node.node.hazineDarkhasti,
                    file: node.node.file,
                    updatedat: node.node.date
                }
            });
        }
    }
    // cosnt {client} = useApolloClient()
    const remoteData =(query)=>{
        setLoading(true);
        console.log(query);
        return client.query({
            query:GET_PAZIRESHES_FOR_TABLE, 
            variables:{
                offset:query.page * query.pageSize,
                first:query.pageSize
            },
            fetchPolicy:'network-only',
            notifyOnNetworkStatusChange:true,
        }).then((res)=>{
            setLoading(false);
            setPageSize(query.pageSize);
            return {
                data:handleCompleted(res.data),
                page:query.page,
                pageSize:query.pageSize,
                totalCount:res.data.allPazireshes.totalCount,
                filters:filters,
            }
        }).catch((error)=>{
            setError(true);
            setLoading(false);
            return null;
        })
    }
    if (error) return <>`Error!`</>;
    const handleOpenModal = (rowData) =>
    {
        setChosenId(rowData.id);
        setOpenModal(true);
    }
    const handleCloseModal = (rowData) =>
    {
        setOpenModal(false);
        setChosenId(false);
    }
    return (
        <div style={{ maxWidth: '100%' }}>
            {
                <MaterialTable
                    icons={tableIcons}
                    isLoading={loading}
                    columns={tableData.columns}
                    data={query =>remoteData(query)}
                    actions={[
                        {
                          icon: EditIcon,
                          tooltip: 'بررسی پذیرش',
                          onClick: (event, rowData) => handleOpenModal(rowData)
                        }
                      ]}
                    title="گزارش پذیرش ها"
                    options={{
                        filtering: true,
                        loadingType:'overlay',
                        pageSizeOptions:[1,2,3,5,8,11],
                        pageSize:pageSize
                    }}
                />
            }
            <EditInquiryModal open={openModal} handleCloseModal={handleCloseModal} id={chosenId}/>
        </div>
    );
}