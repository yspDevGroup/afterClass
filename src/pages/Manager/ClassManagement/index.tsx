/* eslint-disable no-console */
import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { theme } from '@/theme-default';
import { paginationConfig } from '@/constant';
import SearchComponent from '@/components/Search';
import AddCourse from './components/AddCourse';
import CourseType from './components/CourseType';
import type { CourseItem, TableListParams } from './data';
import styles from './index.less';
import type { SearchDataType } from '@/components/Search/data';
import { searchData } from './searchConfig';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { Tooltip } from 'antd';
import ActionBar from './components/ActionBar';
import ClassStart from './components/ClassStart';
import { getQueryString } from '@/utils/utils';
import PromptInformation from '@/components/PromptInformation';
import { getAllKHKCSJ, getKHKCSJ } from '@/services/after-class/khkcsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { Link } from 'umi';
import WWOpenDataCom from './components/WWOpenDataCom';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';

const CourseManagement = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<CourseItem>();
  const [openes, setopenes] = useState(false);
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [readonly, stereadonly] = useState<boolean>(false);
  const [moduletype, setmoduletype] = useState<string>('crourse');
  const [xn, setxn] = useState<string>('');
  const [xq, setxq] = useState<string>('');
  const [kcId, setkcId] = useState<string>('');
  // 查询课程名称
  const [mcData, setmcData] = useState<{ label: string; value: string }[]>([]);
  const [name, setName] = useState<string>('');
  // 控制提示开关
  const [tips, setTips] = useState<boolean>(false);
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  const clstips = () => {
    setTips(false);
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
    if (mcData === []) {
      return setTips(true);
    }
    return setTips(false);
  }, [mcData]);

  useEffect(() => {
    async function fetchData() {
      const res = await queryXNXQList();
      const newData = res.xnxqList;
      const curTerm = res.current;
      const defaultData = [...searchData];
      if (newData.data && newData.data.length) {
        if (curTerm) {
          await setxn(curTerm.XN);
          await setxq(curTerm.XQ);
          actionRef.current?.reload();
          const chainSel = defaultData.find((item) => item.type === 'chainSelect');
          if (chainSel && chainSel.defaultValue) {
            chainSel.defaultValue.first = curTerm.XN;
            chainSel.defaultValue.second = curTerm.XQ;
            await setDataSource(defaultData);
            chainSel.data = newData;
          }
          const ress = getAllKHKCSJ({
            name: '',
            xn: curTerm.XN,
            xq: curTerm.XQ,
            page: 1,
            pageCount: 0,
          });
          Promise.resolve(ress).then((dataes: any) => {
            if (dataes.status === 'ok') {
              const njArry: { label: string; value: string }[] = [];
              dataes.data.map((item: any) => {
                return njArry.push({
                  label: item.KCMC,
                  value: item.id,
                });
              });
              setmcData(njArry);
            }
          });
        }
      } else {
        setkai(true);
      }
    }
    fetchData();
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
        const ress = getAllKHKCSJ({
          name: '',
          xn: res.data?.XNXQ?.XN,
          xq: res.data?.XNXQ?.XQ,
          page: 0,
          pageCount: 0,
        });
        Promise.resolve(ress).then((dataes: any) => {
          if (dataes.status === 'ok') {
            const njArry: { label: string; value: string }[] = [];
            dataes.data.map((item: any) => {
              return njArry.push({
                label: item.KCMC,
                value: item.id,
              });
            });
            setmcData(njArry);
            actionRef.current?.reload();
          }
        });
      })();
    }
  }, []);
  // 监听学年学期更新
  useEffect(() => {
    if (xn && xq) {
      setTimeout(() => {
        actionRef.current?.reload();
      }, 0);
    }
  }, [xn, xq]);
  // 头部input事件
  const handlerSearch = (type: string, value: string, term: string) => {
    if (type === 'year' || type === 'term') {
      setxn(value);
      setxq(term);
      const ress = getAllKHKCSJ({ name: '', xn: value, xq: term, page: 0, pageCount: 0 });
      Promise.resolve(ress).then((dataes: any) => {
        if (dataes.status === 'ok') {
          const njArry: { label: string; value: string }[] = [];
          dataes.data.map((item: any) => {
            return njArry.push({
              label: item.KCMC,
              value: item.id,
            });
          });
          setmcData(njArry);
        }
      });
      actionRef.current?.reload();
    }
    setName(value);
    actionRef.current?.reload();
  };
  // 获取弹框标题
  const getTitle = () => {
    if (moduletype === 'crourse') {
      return '课程类型维护';
    }
    return '开班信息';
  };

  const showDrawer = () => {
    setVisible(true);
    setCurrent(undefined);
    stereadonly(false);
  };

  const handleEdit = (data: any) => {
    const list = {
      ...data,
      NJS: data.NJSName ? data.NJSName?.split(',') : [],
      ZJS: data.ZJS || undefined,
      FJS: data.FJS ? data.FJS?.split(',') : [],
    };
    if (!data.KCTP) {
      // 默认图片地址
      list.KCTP = '';
    }

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
  const maintain = (type: string) => {
    setopenes(true);
    setmoduletype(type);
  };
  const showmodal = () => {
    setopenes(false);
  };

  const columns: ProColumns<CourseItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      valueType: 'index',
      width: 48,
      align: 'center',
    },
    {
      title: '班级名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      width: '12%',
    },
    {
      title: '费用(元)',
      dataIndex: 'FY',
      key: 'FY',
      align: 'center',
      width: 100,
    },
    {
      title: '报名人数(人)',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      width: 100,
      render: (text) => {
        return <a>{text}</a>;
      },
    },
    {
      title: '主班',
      dataIndex: 'ZJS',
      key: 'ZJS',
      align: 'center',
      width: '10%',
      render: (_, record) => {
        return (
          <div>
            <WWOpenDataCom type="userName" openid={record.ZJS} />
          </div>
        );
      },
    },
    // {
    //   title: '所属校区',
    //   align: 'center',
    //   dataIndex: 'XQName',
    //   key: 'XQName',
    //   ellipsis: true,
    // },
    {
      title: '适用年级',
      dataIndex: 'NJSName',
      key: 'NJSName',
      align: 'center',
      ellipsis: true,
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
          return (
            <a>
              <Link to={Url}>排课</Link>
            </a>
          );
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
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '150px',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <ActionBar
              record={record}
              handleEdit={handleEdit}
              maintain={maintain}
              actionRef={actionRef}
            />
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
          request={async (param, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            const opts: TableListParams = {
              ...param,
              sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
              filter,
            };
            if (xn && xq) {
              const obj = {
                xn,
                xq,
                kcId,
                page: 1,
                pageCount: 0,
                name,
              };
              const res = await getAllKHBJSJ(obj, opts);
              return res;
            }
            return [];
          }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
          search={false}
          pagination={paginationConfig}
          headerTitle={
            <SearchComponent
              dataSource={dataSource}
              onChange={(type: string, value: string, trem: string) =>
                handlerSearch(type, value, trem)
              }
            />
          }
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
        <PromptInformation
          text="未查询到课程名称，请设置课程后再来"
          link=""
          open={tips}
          colse={clstips}
        />
        <Modal
          visible={openes}
          onCancel={showmodal}
          title={getTitle()}
          centered
          bodyStyle={{
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
          style={{ maxHeight: '430px' }}
          width="35vw"
          footer={[
            <Button key="back" onClick={() => setopenes(false)}>
              取消
            </Button>,
            <Button key="submit" type="primary">
              确定
            </Button>,
          ]}
        >
          {moduletype === 'crourse' ? <CourseType /> : <ClassStart />}
        </Modal>
      </PageContainer>
    </>
  );
};

export default CourseManagement;
