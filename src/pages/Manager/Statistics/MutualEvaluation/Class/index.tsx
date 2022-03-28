import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
import { Rate, Tooltip } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getClassesEvaluation } from "@/services/after-class/khbjsj"
import { useModel, Link, history } from 'umi';
import styles from '../index.less'
import { Button } from 'antd';
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { getTableWidth } from '@/utils/utils';

const School = (props: any) => {
  const { XNXQId, XNXQ, record } = props.location.state.data;
  const { id, KCMC } = record;
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);

  console.log(record, 'record-------')
  useEffect(() => {
    (async () => {
      const res = await getClassesEvaluation({ XNXQId, KHKCSJId: id })
      if (res.status === 'ok' && res.data) {
        setDataSource(res.data?.rows)
      }
    })()
  }, [])
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center'
    },
    {
      title: '课程班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      width: 120,
      fixed: 'left',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '主班',
      dataIndex: 'KHBJJs',
      key: 'KHBJJs',
      align: 'center',
      width: 150,
      render: (_, record) => {
        return record?.KHBJJs?.map((item: any) => {
          return <div>{item?.JZGJBSJ?.XM}</div>;
        });
      }
    },
    {
      title: '课程班人数',
      dataIndex: 'pj_count',
      key: 'pj_count',
      align: 'center',
      width: 120,
      render: (text: any) => text
    },
    {
      title: '评价人数',
      dataIndex: 'pj_count',
      key: ' pj_count',
      align: 'center',
      width: 100,
      render: (text: any) => text
    },
    {
      title: (
        <span>
          课程评分&nbsp;
          <Tooltip
            overlayStyle={{ maxWidth: '30em' }}
            title={
              <>
                该课程在当前学校所选学年学期内，<br />所有班级家长评价的平均分
              </>
            }
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      dataIndex: 'pj_avg',
      key: 'pj_avg',
      align: 'center',
      width: 180,
      render: (test: any) => {
        const fs = Number(Number(test).toFixed(1)) || 0;
        return <Rate allowHalf defaultValue={fs} disabled={true} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/MutualEvaluation/Detail',
              state: {
                type: 'detail',
                data: { XNXQId, XNXQ, record },
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ]
  return <div>
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
      <div className={styles.TopSearchss}>
        <span>
          学年学期：{XNXQ}
        </span>
        <span style={{ marginLeft: '20px' }}>
          课程名称：{KCMC}
        </span>
      </div>
      <ProTable
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: getTableWidth(columns) }}
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
}
export default School;
