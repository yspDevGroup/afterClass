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
import { getAllXNXQ } from '@/services/after-class/xnxq';
import { convertData } from '@/components/Search/util';
import { getQueryString } from '@/utils/utils';
import PromptInformation from '@/components/PromptInformation';
import { getAllKHKCSJ, getKHKCSJ } from '@/services/after-class/khkcsj';

const ClassMaintenance = () => {
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
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  // 弹框名称设定
  const [names, setnames] = useState<string>('bianji');

  useEffect(() => {
    async function fetchData() {
      const res = await getAllXNXQ({});
      if (res.status === 'ok') {
        const { data = [] } = res;
        const defaultData = [...searchData];
        const newData = convertData(data);
        if (newData.data && newData.data.length > 0) {
          const term = newData.subData[newData.data[0].key];
          const chainSel = defaultData.find((item) => item.type === 'chainSelect');
          if (chainSel && chainSel.defaultValue) {
            chainSel.defaultValue.first = newData.data[0].key;
            await setxn(chainSel.defaultValue.first);
            chainSel.defaultValue.second = term[0].key;
            await setxq(chainSel.defaultValue.second);
            await setDataSource(defaultData);
            chainSel.data = newData;
            actionRef.current?.reload();
            
            const ress = getAllKHKCSJ({
              name: '',
              xn: chainSel.defaultValue.first,
              xq: chainSel.defaultValue.second,
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
              }
            });
          }
        } else {
          setkai(true);
        }
      } else {
        console.log(res.message);
      }
        const defaultData = [...searchData];
        const grideSel = defaultData.find((item: any) => item.type === 'select');
        if (grideSel && grideSel.data) {
          grideSel.defaultValue!.first = '';
          grideSel.data = '';
        }
        setDataSource(defaultData);
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
        const id = { id: curId };
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
    const njIds: any[] = [];
    data.NJSJs?.map((item: any) => njIds.push(item.id));
    const list = { ...data, njIds };
    list.KCTP = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
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
  const request = async (
    param: TableListParams,
    sorter: Record<string, any> | undefined,
    filter: any,
  ) => {
    const opts: TableListParams = {
      ...param,
      sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
      filter,
    };
    const obj = {
      xn,
      xq,
      kcId,
      page: 1,
      pageCount: 20,
      name,
    };
    if (xn === '' || xq === '') {
      return '';
    }
    return getAllKHBJSJ(obj, opts);
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
      title: '主班',
      dataIndex: 'ZJS',
      key: 'ZJS',
      align: 'center',
      width: '10%',
    },

    {
      title: '副班',
      dataIndex: 'FJS',
      key: 'FJS',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '所属校区',
      align: 'center',
    },
    {
      title: '适用年级',
      dataIndex: 'NJMC',
      key: 'NJMC',
      align: 'center',
      ellipsis: true,
      render: (_, record) => {
        const cc: any[] = [];
        record.NJSJs?.map((item: any) => {
          return cc.push(item.NJMC);
        });
        return (
          <div className="ui-table-col-elp">
            <Tooltip title={cc} arrowPointAtCenter>
              {cc?.map((item) => {
                return (
                  <>
                    <Tag>{item}</Tag>
                  </>
                );
              })}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'BJZT',
      key: 'BJZT',
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
          request={request}
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
              style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
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

export default ClassMaintenance;