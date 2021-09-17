import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getKHTKSJ,updateKHTKSJ } from '@/services/after-class/khtksj'
import { useModel, } from 'umi';
import type { ColumnsType } from 'antd/lib/table';
import { Select, Table,Popconfirm,Divider,message } from 'antd';
import Style from './index.less'
// import { text } from 'express';
const { Option } = Select;
///退课
const ReimbursementClass = () => {
  // 获取到当前学校的一些信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 表格数据源
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  useEffect(() => {
    //获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
          //  拿到默认值 发送请求
        }
      } else {
        setkai(true);
      }
    })();

  }, [])
  useEffect(() => {
    ChoseSelect(curXNXQId)
   

  },[curXNXQId,])
  ///table表格数据
  const columns: ColumnsType<API.KHXSDD> | undefined = [
    
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
    },
    {
      title: '课程名称 ',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render:(text:any)=>{
        return text?.KHKCSJ?.KCMC
      }
     

    },
    {
      title: '班级名称  ',
      dataIndex: 'KHBJSJ',
      key: 'KHBJSJ',
      align: 'center',
      render:(text: any)=>{
       return text?.BJMC
        
      }

    },
   

    {
      title: '退课课时数',
      dataIndex: 'KSS',
      key: 'KSS',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      key: 'ZT',
      align: 'center',
      render:(record: any)=>{
        return record.ZT===0?'申请中':'退课'

      }

    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      align: 'center',
      render:(ReturnClass: { ZT: number; id: any; })=>(
        ReturnClass.ZT===0?
         <>
        <Popconfirm 
         title="确认要同意么?"
         onConfirm={async ()=>{
          try{
            if(ReturnClass.id){
             const params = { id:ReturnClass.id};
              const body={ZT:1}
              const res3=await updateKHTKSJ(params,body)
              if(res3.status==='ok'){
                ChoseSelect(curXNXQId)
                message.success('已同意退课')
              }
          }

          }catch(err){
            message.error('删除课程出现错误，请联系管理员确认已删除')

          }
         }
        
        }
        >
        <a>同意</a>
        
        </Popconfirm>
        <Divider type='vertical'/>
        <Popconfirm 
         title="不同意"
         onConfirm={
           async ()=>{
            try{
              if(ReturnClass.id){
               const params = { id:ReturnClass.id};
                const body={ZT:1}
                const res3=await updateKHTKSJ(params,body)
                if(res3.status==='ok'){
                  message.success('驳回退课申请')
                }
            }
  
            }catch(err){
              message.error('删除课程出现错误，请联系管理员确认已删除')
  
            }
             
           }
         }
        >
        <a>不同意</a>
        </Popconfirm>
       
       
        </>:''
      )
       
      
    },
    

  ]
  //学年学期选相框触发的函数
   const  ChoseSelect= async (SelectData:string)=>{
    const res3 = await getKHTKSJ({
      XXJBSJId: currentUser?.xxId,
      XNXQId:SelectData

    });
    if(res3.status === 'ok'){
      console.log(res3?.data?.rows);

      setDataSource(res3?.data?.rows);
    }


   }
   


  return (
    ///PageContainer组件是顶部的信息
    <PageContainer>
      <div className={Style.TopSearchs}>
        <span>
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 200 }}
            onChange={(value: string) => {
              //更新多选框的值
              setCurXNXQId(value);
             }}
          >
            {termList?.map((item: any) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </span>
      </div>
      <div >
        <Table  columns={columns} dataSource={dataSource} rowKey="id" />
      </div>


    </PageContainer>

  )
}
export default ReimbursementClass