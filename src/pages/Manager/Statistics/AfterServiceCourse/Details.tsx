import PageContain from '@/components/PageContainer';
import { getKHFWBJ, getStudentListByBjid } from '@/services/after-class/khfwbj';
import { Badge, Button, message, Modal, Select, Spin, Tabs, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { history } from 'umi';
import { DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import EllipsisHint from '@/components/EllipsisHint';
import { getTableWidth } from '@/utils/utils';
import { exportServiceEnroll } from '@/services/after-class/reports';

const { TabPane } = Tabs;
const { Option } = Select;
const Details = (props: any) => {
  const { state } = props.location;
  const { value, XNXQId } = state;
  const [Data, setData] = useState<any>();
  const [dataSource, setDataSource] = useState<any>();
  const [SJId, setSJId] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [SJPZIds, setSJPZIds] = useState<any>([]);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
    },
    {
      title: '学号',
      dataIndex: 'XH',
      key: 'XH',
      align: 'center',
      width: 180,
    },
    {
      title: '学生姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      width: 120,
    },
    {
      title: '辅导班',
      dataIndex: 'XSFWBJs',
      key: 'XSFWBJs',
      align: 'center',
      width: 300,
      render: (text: any) => {
        if (text?.length) {
          const list = text?.[0].XSFWKHBJs?.filter(
            (item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 1,
          ).map((item: any) => {
            return <Tag key={item?.KHBJSJ?.id}> {item?.KHBJSJ?.BJMC}</Tag>;
          });

          if (list) {
            return <EllipsisHint width="100%" text={list} />;
          }
          return '待选课';
        }
        return '—';
      },
    },
    {
      title: '课程班',
      dataIndex: 'XSFWBJs',
      key: 'XSFWBJs',
      align: 'center',
      width: 300,
      render: (text: any) => {
        if (text?.length) {
          const list = text?.[0].XSFWKHBJs?.filter(
            (item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0,
          ).map((item: any) => {
            return <Tag key={item?.KHBJSJ?.id}> {item?.KHBJSJ?.BJMC}</Tag>;
          });
          if (list?.length) {
            return <EllipsisHint width="100%" text={list} />;
          }
          return '待选课';
        }
        return '—';
      },
    },
    {
      title: '报名状态',
      dataIndex: 'XSFWBJs',
      key: 'XSFWBJs',
      align: 'center',
      width: 120,
      render: (text: any) => {
        if (text?.length) {
          if (text?.[0]?.ZT === 2) {
            return '已退课';
          }
          if (text?.[0]?.ZT === 1) {
            return '退课中';
          }
          return '已报名';
        }
        return '未报名';

      },
    },
  ];
  useEffect(() => {
    (
      async () => {
        if (value?.BJSJ?.id) {
          const res = await getKHFWBJ({
            BJSJId: value?.BJSJ?.id,
            XNXQId
          })
          if (res?.status === 'ok') {
            setData(res?.data)
            setSJId(res?.data?.KHFWSJPZs?.[0]?.id)
          }
        }
      }
    )()
  }, [])
  useEffect(() => {
    if (SJId) {
      (
        async () => {
          const result = await getStudentListByBjid({
            BJSJId: value?.BJSJ?.id,
            KHFWSJPZId: SJId,
            XSXMORXH: "",
            ZT: [0, 3],
            page: 0,
            pageSize: 0,
          })
          if (result?.status === 'ok') {
            setDataSource(result?.data?.rows)
          }
          console.log(result, 'result-----')
        }
      )()
    }
  }, [SJId])

  const callback = (key: any) => {
    setSJId(key);
  }

  const onExportClick = () => {
    setLoading(true);
    (async () => {
      const res = await exportServiceEnroll({
        XNXQId,
        BJSJId: value?.BJSJ?.id,
        KHFWSJPZIds: SJPZIds
      });
      if (res.status === 'ok') {
        window.location.href = res.data;
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    })();
  };
  return <div className={styles.Details}>
    <PageContain>
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
      <span style={{ fontSize: '18px', marginLeft: '24px', fontWeight: 'bold' }}>
        {`${value?.BJSJ?.NJSJ?.XD}${value?.BJSJ?.NJSJ?.NJMC}${value?.BJSJ?.BJ}`}
      </span>
      <p className={styles.title}>
        <Button icon={<DownloadOutlined />} type="primary" onClick={() => {
          setIsModalVisible(true);
        }}>
          导出
        </Button>
      </p>
      <Tabs onChange={callback}>
        {
          Data?.KHFWSJPZs.map((values: any) => {
            return <TabPane tab={<><span>{values?.SDBM}</span> <span>{moment(values?.KSRQ).format('MM-DD')}~{moment(values?.JSRQ).format('MM-DD')}</span></>} key={values?.id} />
          })
        }
      </Tabs>
      <Spin spinning={loading}>
        <ProTable
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          search={false}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: getTableWidth(columns) }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </Spin>
      <Modal
        title="导出报名信息"
        visible={isModalVisible}
        className={styles.DCBM}
        onOk={() => {
          if (SJPZIds?.length === 0) {
            message.warning('请选择服务时段')
          } else {
            onExportClick();
            setSJPZIds([]);
            setIsModalVisible(false);
          }
        }}
        onCancel={() => {
          setSJPZIds([]);
          setIsModalVisible(false);
        }}
      >
        <div className={styles.box}>
          <span className={styles.text}>服务时段：</span>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            value={SJPZIds}
            placeholder="请选择服务时段"
            onChange={(items) => {
              setSJPZIds(items)
            }}
          >
            {
              Data?.KHFWSJPZs?.map((item: any) => {
                return <Option value={item.id}>
                  {item?.SDBM} {moment(item?.KSRQ).format('MM-DD')}~{moment(item?.JSRQ).format('MM-DD')}
                </Option>
              })
            }
          </Select>
        </div>

        <div className={styles.tishi}>
          <p>  <Badge color="#aaa" />导出仅支持本行政班已报名课后服务学生相关信息</p>
          <p>  <Badge color="#aaa" />可选择某个/多个时段进行导出</p>
        </div>
      </Modal>
    </PageContain>
  </div>
}

export default Details;
