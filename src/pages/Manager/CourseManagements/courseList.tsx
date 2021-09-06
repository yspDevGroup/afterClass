/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useModel } from 'umi';
import { Button, message, Modal, Popconfirm, Space, Tag } from 'antd';
import React, { useState, useRef, useEffect } from 'react';

import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProCoreActionType } from '@ant-design/pro-utils';
import type { ActionType, ProColumns } from '@ant-design/pro-table';

import { theme } from '@/theme-default';
import EllipsisHint from '@/components/EllipsisHint';
import PromptInformation from '@/components/PromptInformation';

import MechanismInfo from './components/MechanismInfo';
import SchoolInfo from './components/SchoolInfo';
import Sitclass from './components/Sitclass';
import NewCourses from './components/NewCourses';
import type { classType, TableListParams } from './data';

import { getAllNJSJ } from '@/services/after-class/njsj';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { updateKHKCSQ } from '@/services/after-class/khkcsq';
import { deleteKHKCSJ, getAllKHKCSJ, updateKHKCSJ } from '@/services/after-class/khkcsj';

const CourseList = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [current, setCurrent] = useState<classType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  // 课程类型
  const [kclxOptions, setOptions] = useState<any[]>([]);
  // 适用年级
  const [optionsNJ, setOptionsNJ] = useState<any[]>([]);
  // 机构详情抽屉
  const [visibleMechanismInfo, setVisibleMechanismInfo] = useState(false);
  // 课程详情抽屉
  const [visibleSchoolInfo, setVisibleSchoolInfo] = useState(false);
  // 机构详情
  const [info, setInfo] = useState({});
  const [readonly, setReadonly] = useState<boolean>(false);
  const [opentype, setOpentype] = useState(false);
  // 学年学期没有时的提示框控制
  const [kai, setkai] = useState<boolean>(false);
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
  useEffect(() => {
    // 课程类型
    const res = getAllKHKCLX({ name: '' });
    Promise.resolve(res).then((data) => {
      if (data.status === 'ok') {
        const opt: any[] = [];
        data.data?.map((item: any) => {
          return opt.push({
            label: item.KCTAG,
            value: item.id,
          });
        });
        setOptions(opt);
      }
    });
    // 适用年级
    const resNJ = getAllNJSJ({ XXJBSJId: currentUser?.xxId });
    Promise.resolve(resNJ).then((data) => {
      if (data.status === 'ok') {
        const optNJ: any[] = [];
        const nj = ['幼儿园', '小学', '初中', '高中'];
        nj.forEach((itemNJ) => {
          data.data?.rows?.forEach((item) => {
            if (item.XD === itemNJ) {
              optNJ.push({
                label: item.XD === '初中' ? item.NJMC : `${item.XD}${item.NJMC}`,
                value: item.id,
              });
            }
          });
        });
        setOptionsNJ(optNJ);
      }
    });
  }, []);
  const handleOperation = (type: string, data?: any) => {
    if (type !== 'chakan') {
      setReadonly(false);
      setOpen(true);
    }
    if (data) {
      const list = { ...data, njIds: data.NJSJs.map((item: any) => item.id) };
      setCurrent(list);
      setInfo(data);
    } else {
      setCurrent(undefined);
    }
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

  /** 操作 */
  const funOption = (record: any, action: ProCoreActionType<{}>) => {
    if (record.SSJGLX === '机构课程') {
      return (
        <>
          <a
            onClick={() => {
              setVisibleMechanismInfo(true);
              handleOperation('chakan', record);
            }}
          >
            机构详情
          </a>
          {record.KHKCSQs.length > 0 ? (
            <a
              onClick={() => {
                Modal.confirm({
                  title: `确认要取消引入 “ ${record.KCMC} ” 吗？`,
                  icon: <ExclamationCircleOutlined />,
                  content: '取消后将终止该门课程，请谨慎',
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    const res = updateKHKCSQ({ id: record?.KHKCSQs[0]?.id }, { ZT: 3 });

                    Promise.resolve(res).then((data) => {
                      if (data.status === 'ok') {
                        message.success('操作成功');
                        action?.reload();
                      } else {
                        message.error(data.message);
                      }
                    });
                  },
                });
              }}
            >
              取消引入
            </a>
          ) : (
            ''
          )}
        </>
      );
    }

    return (
      <>
        {record.KCZT === 0 ? (
          <>
            <a
              onClick={async () => {
                const res = await updateKHKCSJ({ id: record?.id }, { KCZT: 1 });
                if (res.status === 'ok') {
                  message.success('操作成功');
                  action?.reload();
                } else {
                  message.error('操作失败');
                }
              }}
            >
              发布
            </a>
            <a onClick={() => handleOperation('add', record)}>修改</a>
            <Popconfirm
              title={`确定要删除 “${record?.KCMC}” 吗?`}
              onConfirm={async () => {
                const res = await deleteKHKCSJ({ id: record?.id });
                if (res.status === 'ok') {
                  message.success('操作成功');
                  action?.reload();
                } else {
                  message.error(res.message);
                }
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        ) : (
          <a
            onClick={async () => {
              const res = await updateKHKCSJ({ id: record?.id }, { KCZT: 0 });
              if (res.status === 'ok') {
                message.success('操作成功');
                action?.reload();
              } else {
                message.error('操作失败');
              }
            }}
          >
            下架
          </a>
        )}
      </>
    );
  };
  const columns: ProColumns<any>[] = [
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: '课程来源',
      align: 'center',
      width: 110,
      key: 'SSJGLX',
      dataIndex: 'SSJGLX',
      valueType: 'select',
      valueEnum: {
        校内课程: { text: '校内课程' },
        机构课程: { text: '机构课程' },
      },
    },
    {
      title: '机构名称',
      align: 'center',
      width: 200,
      key: 'KHJYJG',
      // search: false,
      render: (_, record) => {
        return <>{record.KHJYJG?.QYMC || '-'}</>;
      },
    },
    {
      title: '课程类型',
      align: 'center',
      width: 110,
      key: 'KHKCLXId',
      valueType: 'select',
      fieldProps: {
        options: kclxOptions,
      },
      render: (_, record) => {
        return <>{record.KHKCLX?.KCTAG}</>;
      },
    },
    {
      title: '适用年级',
      key: 'NJSJs',
      dataIndex: 'NJSJs',
      search: false,
      align: 'center',
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.map((item: any) => {
              return (
                <Tag key={item.id}>
                  {item.XD === '初中' ? `${item.NJMC}` : `${item.XD}${item.NJMC}`}
                </Tag>
              );
            })}
          />
        );
      },
    },
    {
      title: '班级信息',
      align: 'center',
      search: false,
      width: 100,
      render: (_, record) => {
        const Url = `/classManagement`;
        const classes = record.KHBJSJs?.filter((item: { BJZT: string }) => item.BJZT === '已发布');
        return (
          <Link to={Url}>
            {classes?.length}/{record.KHBJSJs?.length}
          </Link>
        );
      },
    },
    {
      title: '状态',
      align: 'center',
      ellipsis: true,
      dataIndex: 'KCZT',
      key: 'KCZT',
      search: false,
      width: 110,
      render: (_, record) => {
        if (record.SSJGLX === '机构课程') {
          return record.KHKCSQs.length > 0 ? '已引入' : '';
        }
        return record.KCZT === 0 ? '未发布' : '已发布';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      key: 'option',
      width: 300,
      align: 'center',
      render: (text, record, index, action) => (
        <Space size="middle">
          <a
            onClick={() => {
              handleOperation('chakan', record);
              setVisibleSchoolInfo(true);
            }}
          >
            课程详情
          </a>
          {funOption(record, action)}
        </Space>
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
              pageSize: params.pageSize,
              page: params.current,
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
              新增本校课程
            </Button>,
          ]}
        />
        <MechanismInfo // 机构详情页
          onMechanismInfoClose={() => {
            setVisibleMechanismInfo(false);
          }}
          visibleMechanismInfo={visibleMechanismInfo}
          info={info}
        />
        <SchoolInfo // 课程详情页
          onSchoolInfoClose={() => {
            setVisibleSchoolInfo(false);
          }}
          visibleSchoolInfo={visibleSchoolInfo}
          info={info}
        />
        <NewCourses
          actionRef={actionRef}
          visible={open}
          onClose={onClose}
          current={current}
          readonly={readonly}
          kclxOptions={kclxOptions}
          setOpentype={setOpentype}
          optionsNJ={optionsNJ}
          currentUser={currentUser}
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
