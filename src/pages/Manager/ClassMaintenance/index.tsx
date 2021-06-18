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
import { searchData } from './searchConfig';
import { getAllKHBJSJ } from '@/services/after-class/khbjsj';
import { Tooltip } from 'antd';
import ActionBar from './components/ActionBar';
import ClassStart from './components/ClassStart';
import { getQueryString } from '@/utils/utils';
import PromptInformation from '@/components/PromptInformation';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import type { SearchDataType } from '@/components/Search/data';

const ClassMaintenance = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<CourseItem>();
  const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
  const [openes, setopenes] = useState(false);
  const actionRef = useRef<ActionType>();
  const [readonly, stereadonly] = useState<boolean>(false);
  const [moduletype, setmoduletype] = useState<string>('crourse');
  const [kcId, setkcId] = useState<string>('');
  // 学期学年没有数据时提示的开关
  const [kai, setkai] = useState<boolean>(false);
  // 控制学期学年数据提示框的函数
  const kaiguan = () => {
    setkai(false);
  };
  // 弹框名称设定
  const [names, setnames] = useState<string>('bianji');

  useEffect(() => {
    const curId = getQueryString('courseId');
    if (curId) {
      // 根据课程id重新获取学年学期回调搜索框
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      setkcId(curId);
      (async () => {
        const id = { id: curId };
        const res = await getKHKCSJ(id);
        if (res.status === 'ok') {
          const newData =  [...searchData];
          newData[0].data = [res.data.KCMC];
          console.log(newData);
          
          setDataSource(newData)
        }
      })();
    }
  }, []);
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
            return getAllKHBJSJ({
              kcId,
              name:'',
              page: 1,
              pageCount: 20,
            }, opts);
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
            <SearchComponent dataSource={dataSource} />
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
