/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useModel } from 'umi';
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Form,
  Input,
  Select,
  Row,
  Col,
} from 'antd';

import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ProCoreActionType } from '@ant-design/pro-utils';
import type { ActionType, ProColumns } from '@ant-design/pro-table';

import { theme } from '@/theme-default';
import EllipsisHint from '@/components/EllipsisHint';
import PromptInformation from '@/components/PromptInformation';

import MechanismInfo from './components/MechanismInfo';
import CourseInfo from './components/CourseInfo';
import Sitclass from './components/Sitclass';
import NewCourses from './components/NewCourses';
import type { classType, TableListParams } from './data';

import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { updateKHKCSQ } from '@/services/after-class/khkcsq';
import {
  deleteKHKCSJ,
  getAllCourses,
  getTeacherByClassId,
  updateKHKCSJ,
} from '@/services/after-class/khkcsj';
import { getAllGrades, KHJYJG } from '@/services/after-class/khjyjg';
import { createKHKCPJ, updateKHKCPJ, deleteKHKCPJ } from '@/services/after-class/khkcpj';
import styles from './index.less';
const { Option } = Select;
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
  // 学年学期没有时的提示框控制
  const [kai, setkai] = useState<boolean>(false);
  const [form] = Form.useForm();
  //要评价课程的信息
  const [courseInfo, setcourseInfo] = useState<any>({});
  // 已评价未评价
  const [Isfinish, setIsfinish] = useState<any>();
  // 关闭学期学年提示框
  const kaiguan = () => {
    setkai(false);
  };
  // 弹出框显示隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
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
    const resNJ = getAllGrades({ XD: currentUser?.XD?.split(',') });
    Promise.resolve(resNJ).then((data) => {
      if (data.status === 'ok') {
        const optNJ: any[] = [];
        const nj = ['幼儿园', '小学', '初中', '高中'];
        nj.forEach((itemNJ) => {
          data.data?.forEach((item: any) => {
            if (item.XD === itemNJ) {
              optNJ.push({
                label: `${item.XD}${item.NJMC}`,
                value: item.id,
              });
            }
          });
        });
        setOptionsNJ(optNJ);
      }
    });
  }, []);
  const handleOperation = async (type: string, data?: any) => {
    if (type !== 'chakan') {
      setReadonly(false);
      setOpen(true);
    }
    if (data) {
      const list = { ...data, njIds: data.NJSJs.map((item: any) => item.id) };
      setCurrent(list);
      if (data.SSJGLX === '机构课程') {
        const res = await getTeacherByClassId({
          KHKCSJId: data.id,
          pageSize: 0,
          page: 0,
        });
        if (res.status === 'ok') {
          setInfo({
            ...data,
            KHKCJs: res?.data?.rows,
          });
        } else {
          setInfo(data);
        }
      } else {
        setInfo(data);
      }
    } else {
      setCurrent(undefined);
    }
  };
  //课程评价弹框的显示隐藏
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleOk = () => {
    form.submit();
  };
  const handleJgxq = async (id: string) => {
    const res = await KHJYJG({ id });
    if (res.status === 'ok') {
      setInfo(res.data);
      setVisibleMechanismInfo(true);
    } else {
      message.warning(res.message);
    }
  };
  const submit = async (value: any) => {
    if (Isfinish > 0 && courseInfo.id) {
      const data = {
        ...value,
        XXJBSJId: currentUser.xxId,
      };
      const res = await updateKHKCPJ({ id: courseInfo.id }, data);
      if (res.status === 'ok') {
        message.success('修改成功');
        setIsModalVisible(false);
        //刷新页面
      }
    } else {
      const res = await createKHKCPJ({
        ...value,
        XXJBSJId: currentUser.xxId,
      });
      if (res.status === 'ok') {
        message.success('保存成功');
        setIsModalVisible(false);
        //刷新页面
      }
    }
    setIsModalVisible(false);
  };

  /** 操作 */
  const funOption = (record: any, action: ProCoreActionType) => {
    if (record.SSJGLX === '机构课程') {
      return (
        <>
          <a
            onClick={() => {
              handleJgxq(record.KHJYJGId);
            }}
          >
            机构详情
          </a>
          <a
            onClick={() => {
              Modal.confirm({
                title: `确认要取消引入 “ ${record.KCMC} ” 吗？`,
                icon: <ExclamationCircleOutlined />,
                content: '取消后将终止该门课程，请谨慎',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  const res = updateKHKCSQ({ id: record?.KHKCSQs?.[0].id }, { ZT: 3 });
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
        </>
      );
    }

    return (
      <>
        {record.KCZT === 0 ? (
          <>
            <Popconfirm
              title="课程发布后，可创建相应课程班，确定发布？"
              onConfirm={async () => {
                const res = await updateKHKCSJ({ id: record?.id }, { KCZT: 1 });
                if (res.status === 'ok') {
                  message.success('操作成功');
                  action?.reload();
                } else {
                  message.error(res.message || '操作失败');
                }
              }}
            >
              <a>发布</a>
            </Popconfirm>
            <a onClick={() => handleOperation('add', record)}>编辑</a>
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
          <Popconfirm
            title="取消发布后，该课程及课程班家长不可见，确定取消？"
            onConfirm={async () => {
              const res = await updateKHKCSJ({ id: record?.id }, { KCZT: 0 });
              if (res.status === 'ok') {
                message.success('操作成功');
                action?.reload();
              } else {
                message.error(res.message || '操作失败');
              }
            }}
          >
            <a>取消发布</a>
          </Popconfirm>
        )}
      </>
    );
  };
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
      title: '课程来源',
      align: 'center',
      width: 150,
      key: 'SSJGLX',
      dataIndex: 'SSJGLX',
      valueType: 'select',
      valueEnum: {
        校内课程: { text: '校内课程' },
        机构课程: { text: '机构课程' },
      },
      render: (_, record) => {
        return <>{record?.KHJYJG?.QYMC || '校内课程'}</>;
      },
    },
    {
      title: '机构名称',
      align: 'center',
      width: 0,
      key: 'JGMC',
      dataIndex: 'JGMC',
      hideInTable: true, // 列表中不显示此列
      render: (_, record) => {
        return <>{record?.KHJYJG?.QYMC || '-'}</>;
      },
    },
    {
      title: '课程类型',
      align: 'center',
      width: 110,
      key: 'KHKCLXId',
      search: false,
      valueType: 'select',
      fieldProps: {
        options: kclxOptions,
      },
      render: (_, record) => {
        return <>{record?.KHKCLX?.KCTAG}</>;
      },
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
              return <Tag key={item?.id}>{`${item?.XD}${item?.NJMC}`}</Tag>;
            })}
          />
        );
      },
    },
    {
      title: '课程班信息',
      align: 'center',
      search: false,
      key: 'NJSJs',
      dataIndex: 'NJSJs',
      width: 100,
      render: (_, record) => {
        const Url = `/courseManagements/classManagement`;
        return (
          <Link
            to={{
              pathname: Url,
              state: record,
            }}
          >
            <Tooltip title={`累计已开设${record.bj_count}个课程班。`}>{record.bj_count}</Tooltip>
          </Link>
        );
      },
    },
    {
      title: (
        <span>
          状态&nbsp;
          <Tooltip
            overlayStyle={{ maxWidth: '30em' }}
            title={
              <>
                <Row>
                  <Col flex="4em" style={{ fontWeight: 'bold' }}>
                    未发布：
                  </Col>
                  <Col flex="auto">仅后台管理员可见</Col>
                </Row>
                <Row>
                  <Col flex="4em" style={{ fontWeight: 'bold' }}>
                    已发布：
                  </Col>
                  <Col flex="auto">该课程下已开班课程班，家长、教育局端可见</Col>
                </Row>
                <Row>
                  <Col flex="4em" style={{ fontWeight: 'bold' }}>
                    已引入：
                  </Col>
                  <Col flex="auto">引入课程下已开班课程班，家长、教育局端可见</Col>
                </Row>
              </>
            }
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      align: 'center',
      ellipsis: true,
      dataIndex: 'KCZT',
      key: 'KCZT',
      search: false,
      width: 100,
      render: (_, record) => {
        if (record?.SSJGLX === '机构课程') {
          return <span style={{ color: '#45C977' }}>已引入</span>;
        }
        return record?.KCZT === 0 ? (
          <span style={{ color: '#666' }}>未发布</span>
        ) : (
          <span style={{ color: '#45C977' }}>已发布</span>
        );
      },
    },
    {
      title: '课程评价',
      align: 'center',
      search: false,
      width: 110,
      render: (_, record) => {
        return record?.KHJYJG?.QYMC ? (
          <a
            onClick={() => {
              setIsModalVisible(true);
              const obj = { KHKCSJId: '', KCMC: '', id: '' };
              obj.KHKCSJId = record?.id;
              obj.KCMC = record?.KCMC;
              obj.id = record?.KHKCPJs[0].id;
              setcourseInfo(obj);
              setIsfinish(record.KHKCPJs.length);
            }}
          >
            {record.KHKCPJs.length ? '已评价' : '未评价'}
          </a>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      key: 'option',
      width: 230,
      fixed: 'right',
      align: 'center',
      render: (_, record, index, action) => (
        <Space size="middle">
          <a
            onClick={() => {
              handleOperation('chakan', record);
              setVisibleSchoolInfo(true);
            }}
          >
            课程详情
          </a>
          {funOption(record, action!)}
        </Space>
      ),
    },
  ];
  return (
    <>
      <div className={styles.main}>
        <ProTable<classType>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          // scroll={{ x: 1300 }}
          request={async (params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            const opts: TableListParams = {
              ...params,
              sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
              filter,
              name: params.keyword,
              pageSize: params.pageSize,
              page: params.current,
              XXJBSJId: currentUser?.xxId,
            };
            const resAll = await getAllCourses(opts);
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
        <CourseInfo // 课程详情页
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
          optionsNJ={optionsNJ}
          currentUser={currentUser}
        />
        <PromptInformation
          text="未查询到学年学期数据，请先设置学年学期"
          link="/basicalSettings/termManagement"
          open={kai}
          colse={kaiguan}
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
        {/* 课程评价的弹出框 */}
        <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} title="课程评价">
          <Form.Item name="id" hidden initialValue={courseInfo.id}>
            <Input disabled />
          </Form.Item>
          <Form form={form} onFinish={submit}>
            <Form.Item
              label="课程名称"
              name="KHKCSJId"
              key="KHKCSJId"
              initialValue={courseInfo.KHKCSJId}
            >
              {courseInfo.KCMC}
            </Form.Item>
            <Form.Item
              label="评价内容"
              name="PY"
              key="PY"
              rules={[{ required: true, message: '请输入评价内容' }]}
            >
              <Input.TextArea placeholder="请输入评价内容" showCount maxLength={200} rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default CourseList;
