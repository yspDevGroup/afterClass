/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { theme } from '@/theme-default';
import { paginationConfig } from '@/constant';
import AddCourse from './components/AddCourse';
import type { CourseItem, TableListParams } from './data';
import styles from './index.less';
import { searchData } from './searchConfig';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { Tooltip } from 'antd';
import ActionBar from './components/ActionBar';
import { getQueryString } from '@/utils/utils';
import PromptInformation from '@/components/PromptInformation';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import { Link } from 'umi';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import moment from 'moment';
import ApplicantInfoTable from '../ClassManagement/components/ApplicantInfoTable';

const ClassMaintenance = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<CourseItem>();
  const actionRef = useRef<ActionType>();
  const [readonly, stereadonly] = useState<boolean>(false);
  const [kcId, setkcId] = useState<string>('');
  // 查询课程名称
  const [mcData, setmcData] = useState<{ label: string; value: string }[]>([]);
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  const [KCName, setKCName] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 报名列表数据
  const [applicantData, setApplicantData] = useState<any>({});
  const [RQDate, setRQDate] = useState<any>([]);

  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  // 弹框名称设定
  const [names, setnames] = useState<string>('bianji');
  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
  }, []);
  useEffect(() => {
    const curId = getQueryString('courseId');
    if (curId) {
      // 根据课程id重新获取学年学期回调搜索框
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      setkcId(curId);
      (async () => {
        const id = { kcId: curId };
        const res = await getKHKCSJ(id);
        if (res.status === 'ok' && res.data?.KCMC) {
          setKCName(res.data?.KCMC);
          const newData = [...searchData];
          newData[0].data = [res.data.KCMC];
          setmcData([
            {
              label: res.data.KCMC,
              value: curId,
            },
          ]);
          setRQDate(res.data);
        }
      })();
    }
  }, []);

  const showDrawer = () => {
    setVisible(true);
    setCurrent(undefined);
    stereadonly(false);
  };

  const showModal = (record: any) => {
    const { BJMC, XQName, KHXSBJs } = record;
    setApplicantData({ KHXSBJs, BJMC, XQName });
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleEdit = (data: any) => {
    const njIds: any[] = [];
    data.NJSJs?.map((item: any) => njIds.push(item.id));
    const list = {
      ...data,
      XQID: data.XQ ? data.XQ?.split(',') : [],
      NJSID: data.NJS ? data.NJS?.split(',') : [],
      NJS: data.NJSName ? data.NJSName?.split(',') : [],
      XQ: data.XQName ? data.XQName?.split(',') : [],
      ZJS: data.ZJS || undefined,
      FJS: data.FJS ? data.FJS?.split(',') : [],
      BMSD: [data.BMKSSJ || data.KHKCSJ.BMKSSJ, data.BMJSSJ || data.KHKCSJ.BMJSSJ],
      SKSD: [data.JKRQ || data.KHKCSJ.JKRQ, data.KKRQ || data.KHKCSJ.KKRQ],
    };
    setVisible(true);
    setCurrent(list);
    if (
      !(data.BJZT === '待发布') &&
      !(data.BJZT === '未排课') &&
      !(data.BJZT === '已下架') &&
      !(data.BJZT === '已排课')
    ) {
      stereadonly(true);
      setnames('chakan');
    } else {
      stereadonly(false);
      setnames('add');
    }
  };

  const onClose = () => {
    setVisible(false);
  };
  const toDay = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const xn = getQueryString('xn');
  const xq = getQueryString('xq');
  const columns: ProColumns<CourseItem>[] = [
    {
      title: '班级名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      width: 180,
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
      ellipsis: true,
      render: (_: any, record: any) => {
        return (
          <Tooltip title={record.KHKCSJ.KCMC}>
            <div className="ui-table-col-elp">{record.KHKCSJ.KCMC}</div>
          </Tooltip>
        );
      },
    },
    {
      title: '费用(元)',
      dataIndex: 'FY',
      key: 'FY',
      align: 'center',
      width: 100,
    },
    {
      title: '报名人数',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      width: 100,
      render: (_: any, record: any) => {
        return (
          <a onClick={() => showModal(record)}>
            {record.KHXSBJs.length}/{record.BJRS}
          </a>
        );
      },
    },
    {
      title: '适用年级',
      dataIndex: 'NJSName',
      key: 'NJSName',
      align: 'center',
      ellipsis: true,
      width: 300,
      render: (_, record) => {
        return (
          <div className="ui-table-col-elp">
            <Tooltip title={record.NJSName} arrowPointAtCenter>
              {record.NJSName?.split(',')?.map((item: any) => {
                return <Tag>{item}</Tag>;
              })}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '排课',
      align: 'center',
      width: 100,
      render: (_, record) => {
        const Url = `/courseScheduling?courseId=${record.id}&xn=${xn}&xq=${xq}`;
        if (record.BJZT === '待发布' || record.BJZT === '已下架') {
          if (record.KHPKSJs && record.KHPKSJs?.length === 0) {
            return <Link to={Url}>未排课</Link>;
          }
          return <Link to={Url}>已排课</Link>;
        }
        return <>已排课</>;
      },
    },
    {
      title: '发布状态',
      dataIndex: 'BJZT',
      key: 'BJZT',
      align: 'center',
      width: 100,
    },
    {
      title: '课程状态',
      dataIndex: 'KCZT',
      key: 'KCZT',
      align: 'center',
      width: 100,
      render: (_: any, record: any) => {
        if (record.BJZT === '已发布') {
          const { BMJSSJ, BMKSSJ, KHKCSJ } = record;
          // 报名开始时间
          const BMStartDate = BMKSSJ || KHKCSJ?.BMKSSJ;
          // 报名结束时间
          const BMEndDate = BMJSSJ || KHKCSJ?.BMJSSJ;
          if (BMStartDate > toDay) {
            return <div>未报名</div>;
          }
          if (toDay > BMStartDate && toDay < BMEndDate) {
            return <div>报名中</div>;
          }
          if (toDay < BMEndDate && toDay > KHKCSJ?.KKRQ) {
            return <div>未开课</div>;
          }
          if (toDay > KHKCSJ?.KKRQ && toDay < KHKCSJ?.JKRQ) {
            return <div>开课中</div>;
          }
          if (toDay > KHKCSJ?.JKRQ) {
            return <div>已结课</div>;
          }
        }
        return <>-</>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 150,
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <ActionBar record={record} handleEdit={handleEdit} actionRef={actionRef} />
          </>
        );
      },
    },
  ];
  return (
    <>
      <PageContainer cls={styles.roomWrapper}>
        <ProTable<any>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={async (
            param: TableListParams,
            sorter: Record<string, any> | undefined,
            filter: any,
          ) => {
            const opts: TableListParams = {
              ...param,
              sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
              filter,
            };
            return getAllKHBJSJ(
              {
                kcId,
                name: '',
                page: 1,
                pageCount: 0,
              },
              opts,
            );
          }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
          pagination={paginationConfig}
          headerTitle={`课程名称：${KCName}`}
          toolBarRender={() => [
            <Button
              style={{ background: theme.btnPrimarybg, borderColor: theme.btnPrimarybg }}
              type="primary"
              key="add"
              onClick={() => showDrawer()}
            >
              <PlusOutlined />
              新增班级
            </Button>,
          ]}
        />
        <AddCourse
          kcId={kcId}
          RQDate={RQDate}
          actionRef={actionRef}
          visible={visible}
          onClose={onClose}
          formValues={current}
          readonly={readonly}
          mcData={mcData}
          names={names}
        />
        <PromptInformation
          text="未查询到学年学期数据，请设置学年学期后再来"
          link="/basicalSettings/termManagement"
          open={kai}
          colse={kaiguan}
        />
        <Modal
          title="报名列表"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width="40vw"
        >
          <ApplicantInfoTable dataSource={applicantData} />
        </Modal>
      </PageContainer>
    </>
  );
};

export default ClassMaintenance;
