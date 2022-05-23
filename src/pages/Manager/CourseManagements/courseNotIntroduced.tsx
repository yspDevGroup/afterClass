/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Input, message, Modal, Popconfirm, Select, Space, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';

import EllipsisHint from '@/components/EllipsisHint';
import MechanismInfo from './components/MechanismInfo';
import CourseInfo from './components/CourseInfo';
import type { classType, TableListParams } from './data';

import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { createKHKCSQ, getToIntroduceBySchool, updateKHKCSQ } from '@/services/after-class/khkcsq';
import { getTeacherByClassId } from '@/services/after-class/khkcsj';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
/**
 * 未引入课程
 * @returns
 */

const { Option } = Select;
const { Search } = Input;
const courseNotIntroduced = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 课程类型
  const [kclxOptions, setOptions] = useState<any[]>([]);
  // 设置表单的查询更新
  const [KCName, setKCName] = useState<string>();
  const [JGName, setJGName] = useState<string>();
  const [KCLXId, setKCLXId] = useState<string>();
  // 机构详情抽屉
  const [visibleMechanismInfo, setVisibleMechanismInfo] = useState(false);
  // 课程详情抽屉
  const [visibleSchoolInfo, setVisibleSchoolInfo] = useState(false);
  // 机构详情
  const [info, setInfo] = useState({});
  const getData = async () => {
    const opts: TableListParams = {
      KCMC: KCName,
      KHJYJG: JGName,
      KHKCLXId: KCLXId,
      XD: currentUser?.XD?.split(/,/g),
      XXJBSJId: currentUser?.xxId,
      XZQHM: currentUser?.XZQHM,
      pageSize: 0,
      page: 0,
    };
    const resAll = await getToIntroduceBySchool(opts);
    if (resAll.status === 'ok' && resAll.data) {
      const newArr: any[] = [];
      resAll.data.rows.forEach((item: any) => {
        newArr.push({
          ...item,
          YRZT: item?.KHKCSQs?.length ? item?.KHKCSQs?.[0]?.ZT : 3,
        });
      });
      setDataSource(newArr);
    }
  };
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
  }, []);

  useEffect(() => {
    getData();
  }, [KCLXId, KCName, JGName]);
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
      ellipsis: true,
      fixed: 'left',
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
      title: '课程来源',
      align: 'center',
      width: 110,
      key: 'SSJGLX',
      dataIndex: 'SSJGLX',
      search: false,
    },
    {
      title: '适用年级',
      key: 'NJSJs',
      dataIndex: 'NJSJs',
      search: false,
      align: 'center',
      width: 200,
      render: (text: any) => {
        return (
          <EllipsisHint
            width="100%"
            text={text?.map((item: any) => {
              return <Tag key={item.id}>{`${item.XD}${item.NJMC}`}</Tag>;
            })}
          />
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'YRZT',
      key: 'YRZT',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '待确认',
          status: 'Processing',
        },
        1: {
          text: '已引入',
          status: 'Success',
          disabled: true,
        },
        2: {
          text: '已拒绝',
          status: 'Error',
        },
        3: {
          text: '未引入',
          status: 'Default',
        },
      },
      width: 100,
    },
    {
      title: '引入时间',
      align: 'center',
      width: 200,
      key: 'times',
      // search: false,
      render: (_, record) => {
        return <>{record?.KHKCSQs?.[0]?.ZT === 1 ? record.KHKCSQs?.[0].updatedAt : '-'}</>;
      },
    },
    {
      title: '备注',
      align: 'center',
      width: 150,
      key: 'BZ',
      dataIndex: 'BZ',
      search: false,
      render: (_, record) => {
        return <>{record?.KHKCSQs?.[0]?.BZ || '—'}</>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      key: 'option',
      width: 250,
      fixed: 'right',
      align: 'center',
      render: (text, record, index, action) => {
        return (
          <Space size="middle">
            <a
              onClick={async () => {
                const res = await getTeacherByClassId({
                  KHKCSJId: record.id,
                  pageSize: 0,
                  page: 0,
                });
                if (res.status === 'ok') {
                  setInfo({
                    ...record,
                    KHKCJs: res?.data?.rows,
                  });
                } else {
                  setInfo(record);
                }
                setVisibleSchoolInfo(true);
              }}
            >
              课程详情
            </a>
            <a
              onClick={() => {
                setInfo(record?.KHJYJG);
                setVisibleMechanismInfo(true);
              }}
            >
              机构详情
            </a>
            {record.KHKCSQs?.length === 0 ||
            record.KHKCSQs?.[0]?.ZT === 2 ||
            record.KHKCSQs?.[0]?.ZT === 3 ? (
              <Popconfirm
                title="确定引入该课程？"
                onConfirm={async () => {
                  try {
                    const params = {
                      KHKCSJId: record?.id || '',
                      SQR: currentUser?.XM || '',
                      SQRId: currentUser?.UserId || '', // 修改userId 为UserId
                      XXJBSJId: currentUser?.xxId || '',
                      KHJYJGId: record?.KHJYJG?.id || '',
                    };
                    const res = await createKHKCSQ({ ...params, ZT: 0 });
                    if (res.status === 'ok') {
                      Modal.success({
                        title: '引入成功，机构确认中...确认后方可建班排课',
                        width: '450px',
                        onOk() {},
                      });
                      getData();
                      // action?.reload();
                    } else {
                      message.error(res.message);
                    }
                  } catch (err) {
                    message.error('引入失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a>引入</a>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="确定取消引入该课程？"
                onConfirm={async () => {
                  try {
                    const res = await updateKHKCSQ({ id: record?.KHKCSQs?.[0]?.id }, { ZT: 3 });
                    if (res.status === 'ok') {
                      message.success('操作成功');
                      getData();
                      // action?.reload();
                    } else {
                      message.error(res.message);
                    }
                  } catch (err) {
                    message.error('取消引入失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a>取消引入</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  console.log(dataSource, 'dataSource------');
  return (
    <div>
      <ProTable<classType>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          defaultCurrent: 1,
        }}
        scroll={{ x: getTableWidth(columns) }}
        dataSource={dataSource}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        search={false}
        headerTitle={
          <>
            <SearchLayout>
              <div>
                <label htmlFor="kcname">课程名称：</label>
                <Search
                  placeholder="课程名称"
                  allowClear
                  onSearch={(value: string) => {
                    setKCName(value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="jgname">机构名称：</label>
                <Search
                  placeholder="机构名称"
                  allowClear
                  onSearch={(value: string) => {
                    setJGName(value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="kctype">课程类型：</label>
                <Select
                  allowClear
                  placeholder="课程类型"
                  onChange={(value) => {
                    setKCLXId(value);
                  }}
                  value={KCLXId}
                >
                  {kclxOptions?.map((op: any) => (
                    <Select.Option value={op.value} key={op.value}>
                      {op.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </SearchLayout>
          </>
        }
      />
      <MechanismInfo // 机构详情页
        onMechanismInfoClose={() => {
          setVisibleMechanismInfo(false);
        }}
        visibleMechanismInfo={visibleMechanismInfo}
        info={info}
      />
      <CourseInfo // 课程详情页
        onSchoolInfoClose={() => {
          setVisibleSchoolInfo(false);
        }}
        visibleSchoolInfo={visibleSchoolInfo}
        info={info}
      />
    </div>
  );
};

export default courseNotIntroduced;


