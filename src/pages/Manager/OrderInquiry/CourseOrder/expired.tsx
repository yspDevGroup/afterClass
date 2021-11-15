/*
 * @description:订单查询页面
 * @author: gxh
 * @Date: 2021-09-23 09:09:58
 * @LastEditTime: 2021-11-12 13:39:12
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Select, Spin } from 'antd';
import { exportStudentOrders, getAllKHXSDD } from '@/services/after-class/khxsdd';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { getAllClasses } from '@/services/after-class/khbjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import PromptInformation from '@/components/PromptInformation';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import styles from './index.less';
import { useModel } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

type selectType = { label: string; value: string };

const OrderInquiry = (props: any) => {
  const DDZT = props.TabState;

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([]);
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [termList, setTermList] = useState<any>();
  // 课程选择框的数据
  const [kcmcData, setKcmcData] = useState<selectType[] | undefined>([]);
  // 班级名称选择框的数据
  const [bjmcData, setBjmcData] = useState<selectType[] | undefined>([]);
  const [kcmc, setKcmc] = useState<any>();
  const [kcmcValue, setKcmcValue] = useState<any>();
  const [bjmc, setBjmc] = useState<any>();
  const [bjmcValue, setBjmcValue] = useState<any>();
  // 学生姓名选择
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
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
      const res = await queryXNXQList(currentUser?.xxId);
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
  const columns: ProColumns<API.KHXSDD>[] | undefined = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 100,
      fixed: 'left',
      render: (_text: any, record: any) => {
        const showWXName = record?.XSJBSJ?.XM === '未知' && record?.XSJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.XSJBSJ.WechatUserId} />;
        }
        return record?.XSJBSJ?.XM;
      },
    },
    {
      title: '订单编号',
      dataIndex: 'DDBH',
      key: 'DDBH',
      align: 'center',
      ellipsis: true,
      width: 180,
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '课程班名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      ellipsis: true,
      width: 140,
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.BJMC}</div>;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      ellipsis: true,
      width: 160,
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.KHKCSJ?.KCMC}</div>;
      },
    },
    {
      title: '课程费用(元)',
      dataIndex: 'KCFY',
      key: 'KCFY',
      align: 'center',
      width: 110,
      render: (_text: any, record: any) => {
        return <div>{record?.KHBJSJ?.FY}</div>;
      },
    },
    {
      title: '教辅费用(元)',
      dataIndex: 'JCFY',
      key: 'JCFY',
      align: 'center',
      width: 110,
      render: (_text: any, record: any) => {
        return <div>{(Number(record.DDFY) - Number(record?.KHBJSJ?.FY)).toFixed(2)}</div>;
      },
    },
    {
      title: '订单总费用(元)',
      dataIndex: 'DDFY',
      key: 'DDFY',
      align: 'center',
      width: 120,
    },
    {
      title: '下单时间',
      dataIndex: 'XDSJ',
      key: 'XDSJ',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (_text: any, record: any) => {
        return record.XDSJ?.substring(0, 16);
      },
    },
    {
      title: '付款时间',
      dataIndex: 'ZFSJ',
      key: 'ZFSJ',
      align: 'center',
      ellipsis: true,
      width: 150,
      hideInTable: DDZT !== '已付款',
      render: (_text: any, record: any) => {
        return record.ZFSJ?.substring(0, 16);
      },
    },
    {
      title: '支付方式',
      dataIndex: 'ZFFS',
      key: 'ZFFS',
      align: 'center',
      ellipsis: true,
      width: 150,
      hideInTable: DDZT !== '已付款',
      render: (_text: any, record: any) => {
        return record.ZFFS;
      },
    },
  ];

  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  const params = {
    page: 0,
    pageSize: 0,
    KHKCSJId: kcmcValue,
    XNXQId: curXNXQId,
    XXJBSJId: currentUser?.xxId,
  };
  const getData = async () => {
    const resAll = await getAllKHXSDD({
      XNXQId: curXNXQId,
      DDZT: DDZT === '已付款' ? ['已付款', '已退款'] : [DDZT],
      XSXM: name,
      DDLX: 0,
      kcmc,
      bjmc,
    });
    if (resAll.status === 'ok') {
      setDataSource(resAll?.data);
    } else {
      setDataSource([]);
    }
  };
  const getBjData = async () => {
    const bjmcResl = await getAllClasses(params);
    if (bjmcResl.status === 'ok') {
      const BJMC = bjmcResl.data.rows?.map((item: any) => ({
        label: item.BJMC,
        value: item.id,
      }));
      setBjmcData(BJMC);
    }
  };
  useEffect(() => {
    (async () => {
      if (curXNXQId) {
        // 通过课程数据接口拿到所有的课程
        const khkcResl = await getAllCourses(params);
        if (khkcResl.status === 'ok') {
          const KCMC = khkcResl.data.rows?.map((item: any) => ({
            label: item.KCMC,
            value: item.id,
          }));
          setKcmcData(KCMC);
          getBjData();
        }
      }
    })();
  }, [curXNXQId]);
  useEffect(() => {
    getBjData();
  }, [kcmcValue]);
  useEffect(() => {
    if(curXNXQId){
      getData();
    }
  }, [curXNXQId, kcmcValue, bjmcValue,name]);
  const onExportClick = () => {
    setLoading(true);
    (async () => {
      const res = await exportStudentOrders({
        XNXQId: curXNXQId,
        DDZT: DDZT === '已付款' ? ['已付款', '已退款'] : [DDZT],
        DDLX: 0,
        kcmc,
        bjmc,
      });
      if (res.status === 'ok' && res.data) {
        window.location.href = res.data;
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    })();
  };

  return (
    <>
      <div className={styles.searchs}>
        <span>
          所属学年学期：
          <Select
            value={curXNXQId}
            style={{ width: 160 }}
            onChange={(value: string) => {
              // 选择不同学期从新更新页面的数据
              setCurXNXQId(value);
              setKcmc('');
              setKcmcValue('');
              setBjmcValue('');
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
        <span style={{ marginLeft: 16 }}>
          所属课程：
          <Select
            style={{ width: 160 }}
            allowClear
            value={kcmcValue}
            onChange={(value: string, option: any) => {
              setKcmc(option?.children);
              setKcmcValue(value);
              setBjmc('');
              setBjmcValue('');
            }}
          >
            {kcmcData?.map((item: selectType) => {
              return (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </span>
        <span style={{ marginLeft: 16 }}>
          所属课程班：
          <Select
            style={{ width: 160 }}
            allowClear
            value={bjmcValue}
            onChange={(value: string, option: any) => {
              setBjmc(option?.children);
              setBjmcValue(value);
            }}
          >
            {bjmcData?.map((item: selectType) => {
              return (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </span>
        <div style={{ marginLeft: 16 }}>
          <span>学生名称：</span>
          <div>
            <Search
              allowClear
              style={{ width: 160 }}
              onSearch={(val) => {
                setName(val)
              }}
            />
          </div>
        </div>
        <span style={{ marginLeft: 'auto' }}>
          <Button icon={<DownloadOutlined />} type="primary" onClick={onExportClick}>
            导出
          </Button>
        </span>
      </div>
      <div className={styles.tableStyle}>
        <Spin spinning={loading}>
          <ProTable<any>
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            pagination={{
              showQuickJumper: true,
              pageSize: 10,
              defaultCurrent: 1,
            }}
            scroll={{ x: DDZT !== '已付款' ? 1300 : 1500 }}
            dataSource={dataSource}
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
            search={false}
          />
        </Spin>
      </div>
      <PromptInformation
        text="未查询到学年学期数据，请先设置学年学期"
        link="/basicalSettings/termManagement"
        open={kai}
        colse={kaiguan}
      />
    </>
  );
};

export default OrderInquiry;
