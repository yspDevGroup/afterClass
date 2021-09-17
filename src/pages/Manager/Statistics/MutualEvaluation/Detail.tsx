import PageContainer from '@/components/PageContainer';
import type { ColumnsType } from 'antd/lib/table';
import { LeftOutlined, } from '@ant-design/icons';


import { Table,Button} from 'antd';


const Detail =(props:any)=>{
    const {state}=props.location
    ///table表格数据
    const columns: ColumnsType<API.KHXSDD> | undefined =[
        {
            title: '学生姓名',
            dataIndex: 'XSXM',
            key: 'XSXM',
            align: 'center',
        },
        {
            title: '班级',
            dataIndex: 'XSXM',
            key: 'XSXM',
            align: 'center',
        },
        {
            title: '评价人',
            dataIndex: 'XSXM',
            key: 'XSXM',
            align: 'center',
        },
        {
            title: '评价时间',
            dataIndex: 'XSXM',
            key: 'XSXM',
            align: 'center',
        },
        {
            title: '课程评分',
            dataIndex: 'XSXM',
            key: 'XSXM',
            align: 'center',
        },
        {
            title: '评价内容',
            dataIndex: 'XSXM',
            key: 'XSXM',
            align: 'center',
        },
        {
            title: '该学生课堂表现',
            dataIndex: 'XSXM',
            key: 'XSXM',
            align: 'center',
            
          
        },

    ]
    return(
        <div>
        <PageContainer>
        <Button
        type="primary"
        onClick={() => {
          history.go(-1);
        }}
        style={{
          marginBottom: '24px'
        }}
      >
        <LeftOutlined />
        返回上一页
      </Button> 
            <div >
                <Table columns={columns}  rowKey="id" />
            </div>
            </PageContainer>
        
        </div>

    )
}
export default  Detail