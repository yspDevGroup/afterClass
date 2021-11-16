import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
// import { message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { useModel, Link } from 'umi';
import { Select, Rate, Form, Spin } from 'antd';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import ProTable from '@ant-design/pro-table';
import { getAllCourses2 } from '@/services/after-class/jyjgsj';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import styles from './index.less'

type selectType = { label: string; value: string };

const { Option } = Select;

const MutualEvaluation: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 学期学年没有数据时提示的开关
  // 表格数据源
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);

  // 课程选择框的数据
  const [kcmcData, setKcmcData] = useState<selectType[] | undefined>([]);
  const [kcmcValue, setKcmcValue] = useState<any>();
  // 课程来源
  const [KCLY, setKCLY] = useState<string>();
  const KCLYData: selectType[] = [
    { label: '校内课程', value: '校内课程' },
    { label: '机构课程', value: '机构课程' },
  ];
  // //课程类型
  const [KCLXId, setKCLXId] = useState<string | undefined>();
  const [KCLXData, setKCLXData] = useState<selectType[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  /// table表格数据
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 120,
      fixed: 'left',
      render: (text: any) => {
        return text;
      },
    },
    {
      title: '课程类型',
      dataIndex: 'KHKCLX',
      key: 'KHKCLX',
      align: 'center',
      width: 120,
      render: (test: any) => {
        return test.KCTAG;
      },
    },
    {
      title: '课程来源',
      dataIndex: 'SSJGLX',
      key: 'SSJGLX',
      align: 'center',
      width: 100,
      render: (test: any) => {
        return test;
      },
    },
    {
      title: '机构名称',
      dataIndex: 'KHJYJG',
      key: 'KHJYJG',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (test: any) => {
        return test?.QYMC || '-';
      },
    },
    {
      title: '开班数量',
      dataIndex: 'bj_count',
      key: 'bj_count',
      align: 'center',
      width: 100,
      render: (test: any) => {
        return test;
      },
    },
    {
      title: '课程评分',
      dataIndex: 'PJFS',
      key: 'PJFS',
      width: 180,
      align: 'center',
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
              pathname: '/statistics/mutualEvaluation/class',
              state: {
                type: 'detail',
                data: { XNXQ: curXNXQId, record },
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];
  const huping = (XNXQId: any) => {
    (async () => {
      setLoading(true);
      const res3 = await getAllCourses({
        XXJBSJId: currentUser.xxId,
        KHKCLXId: KCLXId,
        XNXQId,
        KCMC: kcmcValue,
        SSJGLX: KCLY,
      });
      if (res3.status === 'ok') {
        setLoading(false);
        setDataSource(res3?.data?.rows);
      }
    })();
  };
  // 获取课程
  const getKCData = async () => {
    if (curXNXQId) {
      const params = {
        page: 0,
        pageSize: 0,
        XNXQId: curXNXQId,
        XXJBSJId: currentUser?.xxId,
        XZQHM: currentUser?.XZQHM,
        KCLY,
        KHKCLXId: KCLXId,
      };
      const khkcResl = await getAllCourses2(params);

      if (khkcResl.status === 'ok') {
        const KCMC = khkcResl.data.rows?.map((item: any) => ({
          label: item.KCMC,
          value: item.id,
        }));
        setKcmcData(KCMC);
      }
    }
  };
  /**
   * 获取课程类型数据
   */
  const getKCLXData = async () => {
    const res = await getAllKHKCLX({});
    if (res.status === 'ok') {
      const KCLXItem: any = res.data?.map((item: any) => ({
        value: item.id,
        label: item.KCTAG,
      }));
      setKCLXData(KCLXItem);
      // setKcmcValue(undefined);
    }
  };

  useEffect(() => {
    // 获取学年学期数据的获取
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      // 获取到的整个列表的信息
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
        }
      } else {
      }
    })();
    getKCLXData();
  }, []);

  // 学年学期变化
  useEffect(() => {
    if (curXNXQId) {
      huping(curXNXQId);
    }
  }, [curXNXQId, kcmcValue, KCLXId, KCLY]);

  /**
   * 切换学年学期时 清空课程类型 清空课程名称
   */
  useEffect(() => {
    // 重新请求课程名称
    if (curXNXQId) {
      getKCData();
      setKcmcValue(undefined);
    }
    // 清空选择
  }, [KCLXId, KCLY]);

  useEffect(() => {
    // 重新请求课程名称
    getKCData();
    // 清空选择
    setKCLXId(undefined);
    setKCLY(undefined);
  }, [curXNXQId]);

  return (
    <PageContainer>
      <Form layout="inline" labelCol={{ span: 8 }}>
        <Form.Item label=" 所属学年学期：" style={{ padding: '0 0 24px' }}
            className={styles.XNXQ}>
          <Select
            value={curXNXQId}
            style={{ width: 160 }}
            onChange={(value: string) => {
              // 选择不同学期从新更新页面的数据
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
        </Form.Item>
        <Form.Item label="课程类型: " style={{ padding: '0 0 24px' }}>
          <Select
            value={KCLXId}
            style={{ width: 160 }}
            placeholder="请选择"
            allowClear
            onChange={(value: string) => {
              setKCLXId(value);
            }}
          >
            {KCLXData?.map((item: any) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="课程来源: " style={{ padding: '0 0 24px' }}>
          <Select
            style={{ width: 160 }}
            value={KCLY}
            allowClear
            placeholder="请选择"
            onChange={(value) => {
              setKCLY(value);
            }}
          >
            {KCLYData?.map((item: selectType) => {
              if (item.value) {
                return (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                );
              }
              return '';
            })}
          </Select>
        </Form.Item>
        <Form.Item label="课程名称:" style={{ padding: '0 0 24px' }}>
          <Select
            style={{ width: 160 }}
            value={kcmcValue}
            allowClear
            placeholder="请选择"
            onChange={(value) => {
              setKcmcValue(value);
            }}
          >
            {kcmcData?.map((item: selectType) => {
              if (item.value) {
                return (
                  <Option value={item.label} key={item.label}>
                    {item.label}
                  </Option>
                );
              }
              return '';
            })}
          </Select>
        </Form.Item>
      </Form>
      {/* <div className={Style.TopSearchss}>
        <span>
          所属学年学期：
        </span>
      </div> */}
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
          scroll={{ x: 1200 }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </Spin>
    </PageContainer>
  );
};
export default MutualEvaluation;
