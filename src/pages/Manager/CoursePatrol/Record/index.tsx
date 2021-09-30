import { useModel, } from 'umi';
import { Select, } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { queryXNXQList } from '@/services/local-services/xnxq';
import PageContainer from '@/components/PageContainer';
import { getKHXKJL } from '@/services/after-class/khxkjl'
import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
const { Option } = Select;

const CoursePatrol = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [termList, setTermList] = useState<any>();
  const [dataSource, setDataSource] = useState<any>([]);
  const columns: ProColumns<API.KHXSDD>[] | undefined = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '巡课日期',
      dataIndex: 'RQ',
      key: 'RQ',
      align: 'center',
      width: 120
    },
    {
      title: '巡课教师',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 120
    },
    {
      title: '授课教师',
      dataIndex: '',
      key: '',
      align: 'center',
      width: 120
    },
    {
      title: '是否准时上课',
      dataIndex: 'SFZSSK',
      key: 'SFZSSK',
      align: 'center',
      render: (text) => text ? '是' : '否',
      width: 120
    },
    {
      title: '是否为原定教师',
      dataIndex: 'SFYDJS',
      key: ' SFYDJS',
      align: 'center',
      render: (text) => text ? '是' : '否',
      width: 150
    },
    {
      title: '课堂点名',
      dataIndex: 'SFDM',
      key: ' SFDM',
      align: 'center',
      render: (text) => text ? '是' : '否',
      width: 120
    },
    {
      title: '实到人数是否准确',
      dataIndex: 'RSSFZQ',
      key: ' RSSFZQ',
      align: 'center',
      render: (text) => text ? '是' : '否',
      width: 150
    },
    {
      title: '应到人数',
      dataIndex: 'YDRS',
      key: 'YDRS',
      align: 'center',
      width: 120,
    },
    {
      title: '实到人数',
      dataIndex: 'SDRS',
      key: 'SDRS',
      align: 'center',
      width: 120,
    },
    {
      title: '巡课确认人数',
      dataIndex: 'QRRS',
      key: 'QRRS',
      align: 'center',
      width: 120,
    },
    {
      title: '备注信息',
      dataIndex: 'BZXX',
      key: 'BZXX',
      align: 'center',
      width: 220,
      render: (text) => {
        return (
          <Tooltip title={text}>
            <div style={{
              textOverflow: 'ellipsis',
              width: '100px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textAlign: 'center',
              margin: '0 auto',
            }}>{text}</div>
          </Tooltip>
        )
      }
    },
  ]
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
  useEffect(() => {
    (async () => {
      const res = await getKHXKJL({ XNXQId: curXNXQId })
      if (res.status === 'ok') {
        setDataSource(res.data?.rows)
      }
    })()
  }, [curXNXQId])
  return (
    <PageContainer>
      <div style={{ padding: '24px 0' }}>
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
        dataSource={dataSource}
        columns={columns}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        search={false}
      />


    </PageContainer>
  )
}
export default CoursePatrol
