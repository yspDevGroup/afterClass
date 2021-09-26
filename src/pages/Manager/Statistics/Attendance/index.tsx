import PageContainer from '@/components/PageContainer';
import { Tabs } from 'antd';
import StatisticsTable from './compoents/TeacherTable'
import ProTable, { ProColumns } from '@ant-design/pro-table';

// import StudentTable from './compoents/StudentTable'
const { TabPane } = Tabs;
const LeaveManagement = () => {
    const teacher: ProColumns<any>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            align:'center'

        },
        {
            title: '姓名',
            dataIndex: 'XM',
            key: 'XM',
            align: 'center',
            render: (text) => `${text}老师`


        },
    
        {
            title: '授课班级数',
            dataIndex: 'BJS',
            key: 'BJS',
            align: 'center',
        },
        {
            title: '授课总课时数',
            dataIndex: 'KSS',
            key: 'KSS',
            align: 'center',
        },
        {
            title: '出勤次数',
            dataIndex: 'CQS',
            key: 'CQS',
            align: 'center',
        },
        {
            title: '缺勤次数',
            dataIndex: 'QQS',
            key: 'QQS',
            align: 'center',
        },
        {
            title: '课时总时长',
            dataIndex: 'KSSC',
            key: 'KSSC',
            align: 'center',
        },
   
    ]
    const student: ProColumns<any>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            align:'center'

        },
        {
            title: '姓名',
            dataIndex: 'XM',
            key: 'XM',
            align: 'center',

        },
        {
            title: '报名班级数',
            dataIndex: 'BJS',
            key: 'BJS',
            align: 'center',
        },
        {
            title: '出勤次数',
            dataIndex: 'CQS',
            key: 'CQS',
            align: 'center',
        },
        {
            title: '缺勤次数',
            dataIndex: 'QQS',
            key: 'QQS',
            align: 'center',
        },
        {
            title: '课时总时长',
            dataIndex: 'KSSC',
            key: 'KSSC',
            align: 'center',
        },
    
     


    ]
    return (
        <PageContainer>
            <Tabs>
                <TabPane tab="教师考勤统计" key="1">
                    <StatisticsTable TableList={{ position: '老师', data: teacher }} />
                </TabPane>

                <TabPane tab="学生考勤统计" key="2">
                    <StatisticsTable TableList={{ position: '学生', data: student }} />
                </TabPane>
            </Tabs>

        </PageContainer>
    )
}
export default LeaveManagement