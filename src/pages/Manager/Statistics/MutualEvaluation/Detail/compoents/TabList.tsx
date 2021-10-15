import ProTable from '@ant-design/pro-table';
import { useEffect, useState } from 'react';
// 家长给老师的评价
import { getKHBJPJ } from '@/services/after-class/khbjpj';
import type { ProColumns } from '@ant-design/pro-table';
// 老师对学生
import { getAllKHXSPJ } from '@/services/after-class/khxspj';
// khxspj
import { useModel } from 'umi';
import {Rate,Popover}from 'antd'
import { Modal} from 'antd';

const TabList=(props: any)=>{
    const {ListName,ListState}=props.ListData;
    const {id,KHBJJs}=ListState.record;

    const handleOk = () => {
        setIsModalVisible(false);
      };

      const handleCancel = () => {
        setIsModalVisible(false);
      };

  const teacher: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
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
        title:'评价人',
        dataIndex:'PJR',
        key:'',
        align: 'center',

    },
    {
      title:'评价内容',
      dataIndex: 'PY',
      key: 'PY',
      align: 'center',
      ellipsis:true
    },

  ];

  const student: ProColumns<any>[] = [
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
      render: (_text: any, record: any) => {
        return record?.XSJBSJ?.XM
      },
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`
      },
    },
    {
      title: '课程班名称',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render: (test) => {
        return <span>{test?.BJMC}</span> ;
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
      title:'该学生课堂表现',
      dataIndex: 'PY',
      key: 'PY',
      align: 'center',
      render: (text: any) => {
            return (
                <a
                  onClick={() => {
                    setDetailsValue(text)
                    setIsModalVisible(true)
                  }}
                >
                  课堂表现
                </a>
            );
      },
    },
  ];
   // 弹出框显示隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [DetailsValue, setDetailsValue] = useState('');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

 // 学生评价的详情
//  const[StudentDetails,setStudentDetails]=useState('')
   //   学生详情评价列表
   const [StuList, setStuList] = useState<API.KHXSDD[] | undefined>([]);
   // 老师列表
   const [teacherList, setTeacherList] = useState<API.KHXSDD[] | undefined>([]);
  useEffect(() => {
    if(ListName==='学生评价'){
      (async()=>{
        const res2 = await getAllKHXSPJ({
          KHBJSJId:id,
          JSId:KHBJJs[0].id,
          XNXQId:ListState.XNXQId,
          page: 0,
          pageSize: 0,
        });
        if(res2.status==='ok'){
          // 老师给学生的评语
          setStuList(res2.data?.rows)
        }
        })()

    }else{
      (async () => {
        const res = await getKHBJPJ({
          // 课后班级数据
          KHBJSJId:id,
          XNXQId:ListState.XNXQId,
          XXJBSJId:currentUser.xxId,
          page: 0,
          pageSize: 0,
        });
        if (res?.data?.rows) {
       // 家长给老师的评价
          setTeacherList(res.data.rows);

        }
      })();
    }


  }, []);
  // const getTeacherRemark=(data:any)=>{
  //   (async()=>{
  //     const res2 = await getAllKHXSPJ({
  //       KHBJSJId:ListState.id,
  //       JSId: '',
  //       XNXQId:data.id,
  //       page: 0,
  //       pageSize: 0,
  //     });
  //     if(res2.status==='ok'){
  //       console.log(res2.data?.rows);
  //     }
  //     })()
  // }
    return(
            <div>
          <ProTable
            columns={ListName==='学生评价'?student:teacher}
            dataSource={ListName==='学生评价'?StuList:teacherList}
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
             <span>{DetailsValue}</span>
        </Modal>
        </div>

    )
}
export default TabList
