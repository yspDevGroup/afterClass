/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Select, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import { getAllKHKCSJ } from '@/services/after-class/khkcsj';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import SearchComponent from '@/components/Search';
import PageContainer from '@/components/PageContainer';
import PromptInformation from '@/components/PromptInformation';
import type { SearchDataType } from '@/components/Search/data';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import styles from './index.less';

const { Option } = Select;

type selectType = { label: string; value: string };
/**
 *
 * 订单查询页面
 * @return
 */
const OrderInquiry = () => {
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  const [tableLoading, setTableLoading] = useState(true);
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [termList, setTermList] = useState<any>();
  // 课程选择框的数据
  const [kcmcData, setKcmcData] = useState<selectType[] | undefined>([]);
  // 班级名称选择框的数据
  const [bjmcData, setBjmcData] = useState<selectType[] | undefined>([]);
  const [kcmcValue, setKcmcValue] = useState<any>();
  const [bjmcValue, setBjmcValue] = useState<any>();
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      // 学年学期数据的获取
      const res = await queryXNXQList();
      const newData = res.xnxqList;
      const curTerm = res.current;
      if (newData?.length) {
        if (curTerm) {
          setCurXNXQId(curTerm.id);
          setTermList(newData);
        }
      } else {
        setkai(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (curXNXQId) {
        // 获取订单查询的表格数据
        const resl = await getAllKHXSDD({
          XNXQId: curXNXQId,
        });
        if (resl.status === 'ok') {
          setTableLoading(false);
          setDataSource(resl.data);
          setKcmcValue(undefined);
          setBjmcValue(undefined);
        }

        // 通过课程数据接口拿到所有的课程
        const khkcResl = await getAllKHKCSJ({
          isRequired: false,
          XNXQId: curXNXQId,
          page: 0,
          pageSize: 0,
          name: '',
        });
        if (khkcResl.status === 'ok') {
          const KCMC = khkcResl.data?.map((item: any) => ({ label: item.KCMC, value: item.KCMC }));
          setKcmcData(KCMC);
        }

        // 通过班级数据接口拿到所有的班级
        const bjmcResl = await getAllKHBJSJ({ XNXQId: curXNXQId, page: 0, pageSize: 0, name: '' });
        if (bjmcResl.status === 'ok') {
          const BJMC = bjmcResl.data?.rows?.map((item: any) => ({ label: item.BJMC, value: item.BJMC }));
          setBjmcData(BJMC);
        }
      }
    })();
  }, [curXNXQId]);
  const columns: ColumnsType<API.KHXSDD> | undefined = [
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.KHKCSJ?.KCMC}</div>;
      },
    },
    {
      title: '班级',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.BJMC}</div>;
      },
    },
    {
      title: '适用年级',
      dataIndex: 'class',
      key: 'class',
      align: 'center',
      render: (_text: any, record: any) => {
        return (
          <div className="ui-table-col-elp">
            <Tooltip title={record?.KHBJSJ?.NJSName} arrowPointAtCenter>
              {record?.KHBJSJ?.NJSName?.split(',')?.map((item: any, key: any) => {
                return <Tag key={key}>{item}</Tag>;
              })}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '订单费用(元)',
      dataIndex: 'DDFY',
      key: 'DDFY',
      align: 'center',
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: 'DDZT',
      key: 'DDZT',
      align: 'center',
    },
  ];

  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  const onKcmcChange = async (value: any) => {
    setTableLoading(true);
    setKcmcValue(value);
    // 获取订单查询的表格数据
    const resl = await getAllKHXSDD({
      XNXQId: curXNXQId,
      kcmc: value,
    });
    if (resl.status === 'ok') {
      setTableLoading(false);
      setDataSource(resl.data);
    }
  };

  const onBjmcChange = async (value: any) => {
    setTableLoading(true);
    setBjmcValue(value);

    // 获取订单查询的表格数据
    const resl = await getAllKHXSDD({
      XNXQId: curXNXQId,
      bjmc: value,
    });
    if (resl.status === 'ok') {
      setTableLoading(false);
      setDataSource(resl.data);
    }
  };
  return (
    <PageContainer>
      <div className={styles.searchs}>
        <div>
          <span>
            所属学年学期：
            <Select
              value={curXNXQId}
              style={{ width: 200 }}
              onChange={(value: string) => {
                setCurXNXQId(value);
              }}
            >
              {termList?.map((item: any) => {
                return <Option key={item.value} value={item.value}>{item.text}</Option>;
              })}
            </Select>
          </span>
        </div>
        <div>
          <span>课程名称：</span>
          <div>
            <Select
              style={{ width: 200 }}
              value={kcmcValue}
              allowClear
              placeholder="请选择"
              onChange={onKcmcChange}
            >
              {kcmcData?.map((item: selectType) => {
                return (
                  <Option value={item.label} key={item.label}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
        <div>
          <span>班级名称：</span>
          <div>
            <Select
              style={{ width: 200 }}
              value={bjmcValue}
              allowClear
              placeholder="请选择"
              onChange={onBjmcChange}
            >
              {bjmcData?.map((item: selectType) => {
                return (
                  <Option value={item.label} key={item.label}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
      <div className={styles.tableStyle}>
        <Table
          loading={tableLoading}
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
        />
      </div>
      <PromptInformation
        text="未查询到学年学期数据，请设置学年学期后再来"
        link="/basicalSettings/termManagement"
        open={kai}
        colse={kaiguan}
      />
    </PageContainer>
  );
};

export default OrderInquiry;
