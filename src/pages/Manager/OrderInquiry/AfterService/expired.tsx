/*
 * @description:
 * @author: gxh
 * @Date: 2021-09-23 09:09:58
 * @LastEditTime: 2021-12-13 09:28:40
 * @LastEditors: zpl
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Select, Spin } from 'antd';
import { exportStudentOrders, getAllKHXSDD } from '@/services/after-class/khxsdd';
// import { queryXNXQList } from '@/services/local-services/xnxq';

import styles from './index.less';
import { useModel } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ShowName from '@/components/ShowName';
import { DownloadOutlined } from '@ant-design/icons';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getGradesByCampus } from '@/services/after-class/njsj';
import { getAllBJSJ } from '@/services/after-class/bjsj';

const { Option } = Select;

type selectType = { label: string; value: string };
/**
 *
 * 订单查询页面
 * @return
 */
const { Search } = Input;
const OrderInquiry = (props: any) => {
  const DDZT: string = props.TabState;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<API.KHXSDD[] | undefined>([])
  const [loading, setLoading] = useState<boolean>(false);
  // 校区
  const [campusId, setCampusId] = useState<string>();
  const [campusData, setCampusData] = useState<any[]>();
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [NjId, setNjId] = useState<any>();
  const [NjData, setNjData] = useState<any>();
  const [BJId, setBJId] = useState<string | undefined>(undefined);
  const [bjData, setBJData] = useState<selectType[] | undefined>([]);;
  const [name, setName] = useState<string>();
  // 学年学期筛选
  const termChange = (val: string) => {
    setCurXNXQId(val);
  };
  const getCampusData = async () => {
    const res = await getAllXQSJ({
      XXJBSJId: currentUser?.xxId,
    });
    if (res?.status === 'ok') {
      const arr = res?.data?.map((item) => {
        return {
          label: item.XQMC,
          value: item.id,
        };
      });
      if (arr?.length) {
        let id = arr?.find((item: any) => item.label === '本校')?.value;
        if (!id) {
          id = arr[0].value;
        }
        setCampusId(id);
      }
      setCampusData(arr);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId);
      if (result?.current) {
        setCurXNXQId(result?.current?.id);
      }
    })();
    getCampusData();
  }, []);

  const getNJSJ = async () => {
    if (campusId) {
      const res = await getGradesByCampus({
        XQSJId: campusId,
      });
      if (res.status === 'ok') {
        setNjData(res.data);
      }
    }
  };
  useEffect(() => {
    if (campusId) {
      getNJSJ();
      setBJId(undefined);
      setNjId(undefined);
    }
  }, [campusId]);
  const onCampusChange = (value: any) => {
    setCampusId(value);
  };
  const onBjChange = async (value: any) => {
    setBJId(value);
  };
  const onNjChange = async (value: any) => {
    setNjId(value);
  };

  const getBJSJ = async () => {
    const res = await getAllBJSJ({ XQSJId: campusId, njId: NjId, page: 0, pageSize: 0 });
    if (res.status === 'ok') {
      const data = res.data?.rows?.map((item: any) => {
        return { label: item.BJ, value: item.id };
      });
      setBJData(data);
    }
  };

  useEffect(() => {
    if (NjId) {
      setBJId(undefined);
      getBJSJ();
    }
  }, [NjId, campusId]);
  useEffect(() => {
    (async () => {
      const res = await getAllKHXSDD({
        XXJBSJId: currentUser?.xxId,
        XNXQId: curXNXQId,
        XSXM: name,
        BJSJId: BJId,
        NJSJId: NjId,
        XQSJId: campusId,
        // 父传子判断要请求的状态
        DDZT: DDZT === '已付款' ? ['已付款', '已退款'] : [DDZT],
        DDLX: 2,
      });
      if (res.status === 'ok') {
        setDataSource(res.data);
      }
    })();
  }, [curXNXQId, campusId, NjId, BJId, name]);
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
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
      ),
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
      title: '课后服务名称',
      dataIndex: 'XSJBSJ',
      key: 'XSJBSJ',
      align: 'center',
      width: 200,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSFWBJ?.KHFWBJ?.FWMC}`;
      },
    },
    {
      title: '行政班名称',
      dataIndex: 'XSJBSJ',
      key: 'XSJBSJ',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSFWBJ?.KHFWBJ?.BJSJ?.NJSJ?.NJMC}${record?.XSFWBJ?.KHFWBJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '订单费用(元)',
      dataIndex: 'DDFY',
      key: 'DDFY',
      align: 'center',
      width: 110,
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
      hideInTable: DDZT !== '已付款',
      ellipsis: true,
      width: 150,
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
      render: (_text: any, record: any) => {
        return record.ZFFS?.substring(0, 16);
      },
    },
  ];
  const onExportClick = () => {
    setLoading(true);
    (async () => {
      const res = await exportStudentOrders({
        XNXQId: curXNXQId,
        XSXM: name,
        // 父传子判断要请求的状态
        DDZT: DDZT === '已付款' ? ['已付款', '已退款'] : [DDZT],
        DDLX: 2,
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
            scroll={{ x: DDZT !== '已付款' ? 1000 : 1300 }}
            dataSource={dataSource}
            headerTitle={
              <>
                <SearchLayout>
                  <SemesterSelect XXJBSJId={currentUser?.xxId} onChange={termChange} />
                  <div>
                    <label htmlFor="grade">校区名称：</label>
                    <Select value={campusId} placeholder="请选择" onChange={onCampusChange}>
                      {campusData?.map((item: any) => {
                        return <Option value={item.value}>{item.label}</Option>;
                      })}
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="grade">年级名称：</label>
                    <Select value={NjId} allowClear placeholder="请选择" onChange={onNjChange}>
                      {NjData?.map((item: any) => {
                        return <Option value={item.id}>{`${item.XD}${item.NJMC}`}</Option>;
                      })}
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="kcly">班级名称：</label>
                    <Select value={BJId} allowClear placeholder="班级名称" onChange={onBjChange}>
                      {bjData?.map((item: any) => {
                        return (
                          <Option value={item.value} key={item.value}>
                            {item.label}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="student">学生名称：</label>
                    <Search
                      allowClear
                      style={{ width: 160 }}
                      onSearch={(val) => {
                        setName(val);
                      }}
                    />
                  </div>
                </SearchLayout>
              </>
            }
            options={{
              setting: false,
              fullScreen: false,
              density: false,
              reload: false,
            }}
            search={false}
            toolBarRender={() => [
              <Button icon={<DownloadOutlined />} type="primary" onClick={onExportClick}>
                导出
              </Button>,
            ]}
          />
        </Spin>
      </div>
    </>
  );
};

export default OrderInquiry;
