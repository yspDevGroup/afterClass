import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { useEffect, useState } from 'react';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { useModel, } from 'umi';
import { Select,} from 'antd';
import {getTeachers,getStudents}from '@/services/after-class/reports'


const { Option } = Select;

const Table = (props:any) => {
    const {TableList}=props
const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
    // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  const [studentData, setStudent]=useState<API.KHXSDD[] | undefined>([]);
  useEffect(() => {
    //获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id)
          setTermList(newData);
        }
      }
    })();
  }, []);
  useEffect(()=>{
    //教师列表
     (async()=>{
       const res=await getTeachers({XNXQId:curXNXQId})
       if(res.status === 'ok'){
         console.log(res?.data?.rows,'老师');
         
        setDataSource(res?.data?.rows)
       }
     })(),
     //学生列表
     (async()=>{
      const res2=await getStudents({XNXQId:curXNXQId})
      if(res2.status === 'ok'){
     setStudent(res2?.data?.rows)
      }

     })()

  },[curXNXQId])

    return (
        <>
         <div style={{padding:'24px 0'}}>
        <span  >
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 200 }}
            onChange={(value: string) => {
              //选择不同学期从新更新页面的数据
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
            <ProTable
              columns={TableList.data}
                options={{
                    setting: false,
                    fullScreen: false,
                    density: false,
                    reload: false,
                }}
                // dataSource={dataSource}
                dataSource={TableList.position==='老师'?dataSource:studentData}
                search={false}
             
            />
        </>
    )
}
export default Table