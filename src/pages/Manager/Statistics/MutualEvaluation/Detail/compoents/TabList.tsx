import ProTable from '@ant-design/pro-table';
import { useEffect, useState } from 'react';
import { getKHBJPJ } from '@/services/after-class/khbjpj';
import type { ProColumns } from '@ant-design/pro-table';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllKHXSPJ } from '@/services/after-class/khxspj';
import { useModel } from 'umi';
import {Rate,Popover}from 'antd'
import { Modal} from 'antd';
import { TermItem } from '@/pages/Manager/BasicalSettings/TermManagement/data';

const TabList=(props:any)=>{
    const {ListName,ListState}=props.ListData
    const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
     /// table表格数据
  const columns: ProColumns<TermItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: '',
      key: '',
      align: 'center',
      render: () => {
        return   <span>{ListState.BJMC}</span> ;
      },
    },
    {
      title: '评价时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 200,
    },
    {
      title: '课程评分',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 200,
      render: (_, record) => <Rate count={5} defaultValue={record?.PJFS} disabled={true} />,
    },
     {
        title:ListName==='课程反馈'?'评价人':'',
        dataIndex:ListName==='课程反馈'?'PJR':'',
        key:'',
        align: 'center',
      

    },
    {
      title:ListName==='课程反馈'?'评价内容':'',
      dataIndex: 'PY',
      key: 'PY',
      align: 'center',
      render: (text: any) => {
          if(ListName==='课程反馈'){
            return (
                <Popover content={text}>
                  <div
                    style={{
                      textOverflow: 'ellipsis',
                      width: '100px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textAlign: 'center',
                      margin: '0 auto',
                    }}
                  >
                    {text}
                  </div>
                </Popover>
              );

          }
     
      },
    },
    {
      title:ListName==='学生评价'?'该学生课堂表现':'',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (_, record) => {
          if(ListName==='学生评价'){
            return (
                <a
                  onClick={() => {
                    //发请求的函数
                    manifestation(record);
                    setIsModalVisible(true)
                  }}
          
                >
                  课堂表现
                </a>
      
            );

          }
     
      },
    },
  ];
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [XNXQId, setXNXQId] = useState();
   // 弹出框的显示
  const [isModalVisible, setIsModalVisible] = useState(false);
 // 学生评价的详情
 const[StudentDetails,setStudentDetails]=useState('')
   //点击课堂表现发送的请求
   const manifestation = async (value: any) => {
    const res2 = await getAllKHXSPJ({
      XSId: value.XSId,
      KHBJSJId:ListState.id,
      JSId: '',
      XNXQId: XNXQId!,
      page: 0,
      pageSize: 0,
    });
    if (res2?.data?.rows) {
      //判断是否有值
        if(res2?.data?.rows[0].PY?.length){
           setStudentDetails(res2?.data?.rows[0].PY)

        }
        
     
      
    }
  };
   //   学生详情评价列表
   const [StuList, setStuList] = useState<API.KHXSDD[] | undefined>([]);
   useEffect(() => {
    (async () => {
      const res = await getKHBJPJ({
        // 课后班级数据
        KHBJSJId: ListState.id,
        XSId: '',
        XXJBSJId: '',
        XNXQId: '',
        page: 0,
        pageSize: 0,
      });
      if (res?.data?.rows) {
     
        console.log(res.data.rows);
        
        setStuList(res.data.rows);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      setXNXQId(res.current?.id);
    })();
  }, []);
  
    return(
      
            <div>
          <ProTable
            columns={columns}
            dataSource={StuList}
            rowKey="id"
            search={false}
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
          />
           <Modal visible={isModalVisible} onCancel={handleCancel} title='表现详情'
        footer={null}
        >
             <span>{StudentDetails}</span>
        </Modal>
        </div>

    )
}
export default TabList