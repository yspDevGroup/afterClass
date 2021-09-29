import { getTeacherDetail, getStudentDetail } from '@/services/after-class/reports'
import { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import PageContainer from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import { Button} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { spawn } from '@umijs/utils';
const AttendanceDetail = (props: any) => {
    const { data, XNXQId, position } = props.location.state
    console.log(data);
     useEffect(() => {
        if (position === '老师') {
            (async () => {
                const res = await getTeacherDetail({ KHJSSJId: '1965a118-4b5b-4b58-bf16-d5f45e78b28c', XNXQId })
                if(res.status==='ok'){
                    setDataSource(res.data)
                }
              
              

            })()
        } else {
            (async () => {
                const res = await getStudentDetail({ XSId:data.XSId, XNXQId })
                if(res.status==='ok'){
                    console.log(res.data);
                    
                    setDataSource(res.data)
                }
            })()

        }

    },[])
    const teacher: ProColumns<any>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            align: 'center'
    
        },
        {
            title: '姓名',
            dataIndex: '',
            key: '',
            align: 'center',
            render:()=><div>{data.XM}</div>

            
         },
    
        {
            title: '授课班级数',
            dataIndex: '',
            key: '',
            align: 'center',
            render:()=><div>{data.BJS}</div>
        },
        {
            title: '授课总课时数',
            dataIndex: '',
            key: '',
            align: 'center',
            render:()=><div>{data.KSS}</div>
        },
        {
            title: '出勤次数',
            dataIndex: 'cq_count',
            key: 'cq_count',
            align: 'center',
        },
        {
            title: '缺勤次数',
            dataIndex: 'qq_count',
            key: 'qq_count',
            align: 'center',
        },
        {
            title: '课时总时长(小时)',
            dataIndex: '',
            key: '',
            align: 'center',
            render:()=><div>{data.KSSC}</div>
        },
        {
            title: '课程名称',
            dataIndex: 'KHKCSJ',
            key: 'KHKCSJ',
            align: 'center',
            render:(text)=> <div>{text?.KCMC}</div>
                
            
        },
        {
            title: '班级名称',
            dataIndex: 'BJMC',
            key: 'BJMC',
            align: 'center',
        }

    
    ]
    const student: ProColumns<any>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            align: 'center'
    
        },
        {
            title: '姓名',
            dataIndex: '',
            key: '',
            align: 'center',
            render:()=><div>{data.XM}</div>
    
        },
        {
            title: '报名班级数',
            dataIndex: '',
            key: '',
            align: 'center',
            render:()=><div>{data.BJS}</div>
        },
        {
            title: '出勤次数',
            dataIndex: 'cq_count',
            key: 'cq_count',
            align: 'center',
        },
        {
            title: '缺勤次数',
            dataIndex: 'qq_count',
            key: 'qq_count',
            align: 'center',
        },
        {
            title: '课时总时长(小时)',
            dataIndex: 'KSSC',
            key: 'KSSC',
            align: 'center',
            render:()=><div>{data.KSSC}</div>
        },
        {
            title: '班级名称',
            dataIndex: 'BJMC',
            key: 'BJMC',
            align: 'center',
        },
        {
            title: '课程名称',
            dataIndex: 'KHKCSJ',
            key: 'KHKCSJ',
            align: 'center',
            render:(text)=><div>{text?.KCMC}</div>
        }
      
    
    
    
    
    ]
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);

    

    return (
        <div>
            <PageContainer>
            <Button 
          type="primary"
          onClick={() => {
            history.go(-1);
          }}
          style={{
            marginBottom: '24px',
          }}
        >
          <LeftOutlined />
          返回上一页
        </Button>
                <ProTable
                       columns={position === '老师'?teacher:student}
                       dataSource={dataSource}
                    search={false}
                    options={{
                        setting: false,
                        fullScreen: false,
                        density: false,
                        reload: false,

                    }}
                />




            </PageContainer>
        </div>
    )
}
export default AttendanceDetail