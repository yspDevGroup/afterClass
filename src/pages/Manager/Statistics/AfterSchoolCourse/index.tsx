import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
import { Button, Form, message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { useModel, Link } from 'umi';
import { Select } from 'antd';
import { getCourses, statisCourses } from '@/services/after-class/reports';
import { queryXNXQList } from '@/services/local-services/xnxq';
import ProTable from '@ant-design/pro-table';
import Style from './index.less';
import type { TableItem } from './data';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { getTableWidth } from '@/utils/utils';
import { getAllCourses2 } from '@/services/after-class/khkcsj';

type selectType = { label: string; value: string };

const { Option } = Select;

const AfterSchoolCourse: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 学年学期列表数据
  const [termList, setTermList] = useState<any>();
  // 学期学年没有数据时提示的开关
  // 表格数据源
  const [dataSource, setDataSource] = useState<any>([]);

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

  /// table表格数据
  const columns: ProColumns<TableItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '课程来源',
      dataIndex: 'KCLY',
      key: 'KCLY',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      fixed: 'left',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '课程类型',
      dataIndex: 'KCLX',
      key: 'KCLX',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '所属机构/学校',
      dataIndex: 'JGMC',
      key: 'JGMC',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_, record: any) => {
        return record?.KCLY === '校内课程' ? record?.XXMC : record?.JGMC;
      },
    },
    {
      title: '课程班数量',
      dataIndex: 'BJS',
      key: 'BJS',
      align: 'center',
      width: 130,
      ellipsis: true,
    },
    {
      title: '报名人数',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退课人数',
      dataIndex: 'TKRS',
      key: 'TKRS',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退课比例',
      dataIndex: 'TKBL',
      key: 'TKBL',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (test: any, record: any) => {
        const num =
          record.TKRS != 0 ? `${(Number(record.TKRS / record.BMRS) * 100).toFixed(1)}%` : 0;
        return num;
      },
    },
    {
      title: '收款金额',
      dataIndex: 'SKJE',
      key: 'SKJE',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退款金额',
      dataIndex: 'TKJE',
      key: 'TKJE',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 90,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/afterSchoolCourse/detail',
              state: {
                type: 'detail',
                data: record,
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];

  // 学年学期选相框触发的函数
  const ChoseSelect = async (SelectData: string) => {
    const kclxItem = KCLXData?.find((item: any) => item.value === KCLXId)?.label;
    const res3 = await getCourses({
      XNXQId: SelectData,
      XXJBSJId: currentUser?.xxId,
      KCLX: kclxItem,
      KCLY,
      KHKCSJId: kcmcValue,
    });
    if (res3.status === 'ok') {
      setDataSource(res3?.data?.rows);
    }
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
      ChoseSelect(curXNXQId);
    }
  }, [curXNXQId, kcmcValue, KCLXId, KCLY]);

  /**
   * 切换学年学期时 清空课程类型 清空课程名称
   */
  useEffect(() => {
    // 重新请求课程名称
    if (curXNXQId) {
      getKCData();
      setKcmcValue(null);
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

  const submit = async () => {
    const res = await statisCourses({
      XNXQId: curXNXQId,
    });
    if (res.status === 'ok') {
      message.success('刷新完成');
    }
  };

  return (
    /// PageContainer组件是顶部的信息
    <PageContainer>
      <div className={Style.TopSearchss}>
        <Form layout="inline" labelCol={{ span: 8 }}>
          <Form.Item label="所属学年学期: " style={{ padding: '0 0 24px' }}>
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
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  );
                }
                return '';
              })}
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className={Style.AfterSchoolCourse}>
        <p className={Style.title}>
          <span>系统每天凌晨自动更新一次，如需立即更新，请点击【刷新】按钮</span>
          <Button type="primary" onClick={submit}>
            刷新
          </Button>
        </p>
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
      </div>
      {/* <Link to={{ pathname: '/afterSchoolCourse/detail',}}>详情</Link> */}
    </PageContainer>
  );
};
export default AfterSchoolCourse;
