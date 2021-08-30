/* eslint-disable @typescript-eslint/no-unused-vars */
import PageContainer from '@/components/PageContainer';
import { theme } from '@/theme-default';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { classType, TableListParams } from './data';
import NewCourses from './components/NewCourses';
import styles from './index.less';
import Sitclass from './components/Sitclass';
import { getAllKHKCSJ } from '@/services/after-class/khkcsj';
import type { SearchDataType } from '@/components/Search/data';
import { searchData } from './searchConfig';
import SearchComponent from '@/components/Search';
import { Link, useModel } from 'umi';
import PromptInformation from '@/components/PromptInformation';
import Operation from './components/Operation';
import { queryXNXQList } from '@/services/local-services/xnxq';

const CourseList = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [current, setCurrent] = useState<classType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [xn, setxn] = useState<string>('');
  const [xq, setxq] = useState<string>('');
  const [xnxq, setXnxq] = useState<any>();
  const [readonly, setReadonly] = useState<boolean>(false);
  const [opentype, setOpentype] = useState(false);
  // 学年学期没有时的提示框控制
  const [kai, setkai] = useState<boolean>(false);
  // 设置表单的查询更新
  const [name, setName] = useState<string>('');
  // 关闭学期学年提示框
  const kaiguan = () => {
    setkai(false);
    setOpentype(false);
  };
  const Tips = () => {
    setModalVisible(true);
    setOpen(false);
    setOpentype(false);
  };
  // 图片展示框
  const [exhibition, setExhibition] = useState<'none' | 'block'>('none');
  const [url, setUrl] = useState<string>('');

  // useEffect(() => {
  //   async function fetchData() {
  //     const res = await queryXNXQList();
  //     const newData = res.xnxqList;
  //     const curTerm = res.current;
  //     const defaultData = [...searchData];
  //     setXnxq(newData);
  //     if (newData.data && newData.data.length) {
  //       if (curTerm) {
  //         await setxn(curTerm.XN);
  //         await setxq(curTerm.XQ);
  //         const chainSel = defaultData.find((item) => item.type === 'chainSelect');
  //         if (chainSel && chainSel.defaultValue) {
  //           chainSel.defaultValue.first = curTerm.XN;
  //           chainSel.defaultValue.second = curTerm.XQ;
  //           await setDataSource(defaultData);
  //           chainSel.data = newData;
  //         }
  //       }
  //     } else {
  //       setkai(true);
  //     }
  //   }
  //   fetchData();
  // }, []);
  // 监听学年学期更新
  // useEffect(() => {
  //   if (xn && xq) {
  //     setTimeout(() => {
  //       actionRef.current?.reload();
  //     }, 500);
  //   }
  // }, [xn, xq]);
  const handlerSearch = (type: string, value: string, term: string) => {
    if (type === 'year' || type === 'term') {
      setxn(value);
      setxq(term);
      return true;
    }
    setName(value);
    actionRef.current?.reload();
    return true;
  };
  const handleOperation = (type: string, data?: any) => {
    if (type === 'chakan') {
      setReadonly(true);
    } else {
      setReadonly(false);
    }
    if (data) {
      let KHKCLXId: any[] = [];
      KHKCLXId = data.KHKCLX.id;
      const KKRQ: any[] = [];
      KKRQ.push(data.KKRQ);
      KKRQ.push(data.JKRQ);
      const BMKSSJ: any[] = [];
      BMKSSJ.push(data.BMKSSJ);
      BMKSSJ.push(data.BMJSSJ);
      const XNXQ = {
        XN: data.XNXQ.XN,
        XQ: data.XNXQ.XQ,
      };
      const list = { ...data, KHKCLXId, KKRQ, BMKSSJ, ...XNXQ };
      setCurrent(list);
    } else {
      setCurrent(undefined);
    }
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const cover = (img: any) => {
    setExhibition('block');
    setUrl(img);
  };
  const xclose = () => {
    setExhibition('none');
  };
  const columns: ProColumns<classType>[] = [
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: '课程类型',
      align: 'center',
      width: 110,
      key: 'KHKCLXId',
      search: false,
      render: (_, record) => {
        return <>{record.KHKCLX?.KCLX}</>;
      },
    },
    {
      title: '课程来源',
      align: 'center',
      width: 110,
      key: 'SSJGLX',
      dataIndex: 'SSJGLX',
      search: false,
      // render: (_, record) => {
      //   return <>{record.KHKCLX?.KCLX}</>;
      // },
    },
    {
      title: '班级数',
      align: 'center',
      search: false,
      width: 100,
      render: (_, record) => {
        const Url = `/courseManagements/classMaintenance?courseId=${record.id}`;
        const classes = record.KHBJSJs?.filter((item) => item.BJZT === '已发布');
        return (
          <Link to={Url}>
            {classes?.length}/{record.KHBJSJs?.length}
          </Link>
        );
      },
    },
    {
      title: '课程封面',
      align: 'center',
      width: 120,
      dataIndex: 'KCTP',
      search: false,
      ellipsis: true,
      render: (_, record) => {
        return (
          <>
            <a>
              <span onClick={() => cover(record.KCTP)}>课程封面.png</span>
            </a>
          </>
        );
      },
    },
    {
      title: '简介',
      dataIndex: 'KCMS',
      key: 'KCMS',
      align: 'center',
      search: false,
      ellipsis: true,
    },
    {
      title: '状态',
      align: 'center',
      ellipsis: true,
      dataIndex: 'KCZT',
      key: 'KCZT',
      search: false,
      width: 110,
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      key: 'option',
      width: 150,
      render: (_, record) => (
        <Operation record={record} handleOperation={handleOperation} actionRef={actionRef} />
      ),
    },
  ];
  return (
    <>
      <div
        style={{
          display: `${exhibition}`,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,.45)',
          position: 'fixed',
          zIndex: 1080,
          left: '0',
          top: '0',
        }}
      >
        <div
          style={{ width: '100%', height: '35px', display: 'flex', flexDirection: 'row-reverse' }}
        >
          <a style={{ color: '#fff', marginRight: '10px', fontSize: '24px' }} onClick={xclose}>
            X
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {' '}
          <img
            src={url}
            alt=""
            style={{ margin: 'auto', maxHeight: '100vh', maxWidth: '100vw', paddingBottom: '80px' }}
          />
        </div>
      </div>
      <div>
        <ProTable<classType>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          request={async (params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            const opts: TableListParams = {
              ...params,
              sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
              filter,
              name: params.keyword,
              pageSize: 0,
              page: 1,
              isRequired: false,
              XXJBSJId: currentUser?.xxId,
            };
            const resAll = await getAllKHKCSJ(opts);
            if (resAll.status === 'ok') {
              return {
                data: resAll.data.rows,
                success: true,
                total: resAll.data.count,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          // search={false}
          toolBarRender={() => [
            // <Button key="wh" onClick={() => setModalVisible(true)}>
            //   课程类型维护
            // </Button>,
            <Button
              style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
              type="primary"
              key="add"
              onClick={() => handleOperation('add')}
            >
              <PlusOutlined />
              新增课程
            </Button>,
          ]}
        />
        <NewCourses
          actionRef={actionRef}
          visible={open}
          onClose={onClose}
          current={current}
          readonly={readonly}
          xn={xn}
          xq={xq}
          xnxq={xnxq}
          setOpentype={setOpentype}
        />
        <PromptInformation
          text="未查询到学年学期数据，请设置学年学期后再来"
          link="/basicalSettings/termManagement"
          open={kai}
          colse={kaiguan}
        />
        <PromptInformation
          text="未查询到课程类型，请设置课程类型后再来"
          open={opentype}
          colse={kaiguan}
          event={Tips}
        />
        <Modal
          title="课程类型维护"
          destroyOnClose
          width="500px"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          centered
          maskClosable={false}
          bodyStyle={{
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
        >
          <Sitclass />
        </Modal>
      </div>
    </>
  );
};

export default CourseList;
