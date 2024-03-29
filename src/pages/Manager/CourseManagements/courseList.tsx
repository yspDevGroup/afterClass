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
import { getKHKCPJ, createKHKCPJ, updateKHKCPJ } from '@/services/after-class/khkcpj';
import styles from './index.less';
import { getTableWidth } from '@/utils/utils';
import SearchLayout from '@/components/Search/Layout';
import { queryXNXQList } from '@/services/local-services/xnxq';

const { Option } = Select;
const { Search } = Input;
const CourseList = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [current, setCurrent] = useState<classType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 当前学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 课程类型
  const [kclxOptions, setOptions] = useState<any[]>([]);
  // 设置表单的查询更新
  const [KCName, setKCName] = useState<string>();
  const [JGName, setJGName] = useState<string>();
  const [KCLXId, setKCLXId] = useState<string>();
  const [KCLY, setKCLY] = useState<string>();
  // 适用年级
  const [optionsNJ, setOptionsNJ] = useState<any[]>([]);
  // 机构详情抽屉
  const [visibleMechanismInfo, setVisibleMechanismInfo] = useState(false);
  // 课程详情抽屉
  const [visibleSchoolInfo, setVisibleSchoolInfo] = useState(false);
  // 机构详情
  const [info, setInfo] = useState({});
  const [readonly, setReadonly] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [pjFooter, setPjFooter] = useState<boolean>(true);
  // 弹出框显示隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
  const getData = async () => {
    const opts: TableListParams = {
      XNXQId: curXNXQId,
      KCMC: KCName,
      JGMC: JGName,
      KHKCLXId: KCLXId,
      SSJGLX: KCLY,
      pageSize: 0,
      page: 0,
      XXJBSJId: currentUser?.xxId,
    };
    const resAll = await getAllCourses(opts);
    if (resAll.status === 'ok' && resAll.data) {
      setDataSource(resAll.data.rows);
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
    // 获取当前学年学期
    async function fetchData() {
      const resTerm = await queryXNXQList(currentUser?.xxId);
      const curTerm = resTerm.current;
      if (curTerm) {
        setCurXNXQId(curTerm.id);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (curXNXQId) {
      getData();
    }
  }, [curXNXQId, KCLXId, KCName, JGName, KCLY]);
  const handleOperation = async (type: string, data?: any) => {
    if (type !== 'chakan') {
      setReadonly(false);
      setOpen(true);
    }
    if (data) {
      const list = { ...data, njIds: data.NJSJs.map((item: any) => item.id) ,type};
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
  // 课程评价弹框的显示隐藏
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleOk = () => {
    form.submit();
  };
  // 获取机构详情
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
    if (value.id) {
      const { id, ...rest } = value;
      const data = {
        ...rest,
        XXJBSJId: currentUser.xxId,
      };
      const res = await updateKHKCPJ({ id }, data);
      if (res.status === 'ok') {
        message.success('修改成功');
        setIsModalVisible(false);
        // 刷新页面
        getData();
      }
    } else {
      const res = await createKHKCPJ({
        ...value,
        XXJBSJId: currentUser.xxId,
      });
      if (res.status === 'ok') {
        message.success('保存成功');
        setIsModalVisible(false);
        // 刷新页面
        getData();
      }
    }
    setIsModalVisible(false);
  };
  const getEvaluate = async (obj: any) => {
    if (obj.id) {
      const res = await getKHKCPJ({ id: obj.id });
      if (res.status === 'ok') {
        setPjFooter(false);
        form.setFieldsValue({ PY: res.data.PY, ...obj });
      }
    } else {
      setPjFooter(true);
      form.setFieldsValue({ PY: '', ...obj });
    }
    setIsModalVisible(true);
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
                content: '取消后将终止该门课程，请谨慎操作',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  const res = updateKHKCSQ({ id: record?.KHKCSQs?.[0].id }, { ZT: 3 });
                  Promise.resolve(res).then((data) => {
                    if (data.status === 'ok') {
                      message.success('操作成功');
                      getData();
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
            <a onClick={() => handleOperation('add', record)}>编辑</a>
            <a onClick={() => handleOperation('copy', record)}>复制</a>
            <Popconfirm
              title={`确定要删除 “${record?.KCMC}” 吗?`}
              onConfirm={async () => {
                const res = await deleteKHKCSJ({ id: record?.id });
                if (res.status === 'ok') {
                  message.success('操作成功');
                  getData();
                  actionRef?.current?.reloadAndRest?.();
                } else {
                  message.error(res.message);
                }
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        ) : (
          ''
          //   <Popconfirm
          //     title="取消发布后，该课程及课程班家长不可见，确定取消？"
          //     onConfirm={async () => {
          //       const res = await updateKHKCSJ({ id: record?.id }, { KCZT: 0 });
          //       if (res.status === 'ok') {
          //         message.success('操作成功');
          //         getData();
          //       } else {
          //         message.error(res.message || '操作失败');
          //       }
          //     }}
          //   >
          //     <a>取消发布</a>
          //   </Popconfirm>
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
      render: (_, record) => {
        return (
          <>
            {record?.SSJGLX === '机构课程' && record?.KCZT !== 2 ? (
              <Tooltip
                title="该课程已下架或取消授权，结课后无法再次合作。"
                overlayClassName={styles.tishi}
              >
                {record?.KCMC}
                <ExclamationCircleOutlined style={{ color: '#FF5722', marginLeft: '5px' }} />
              </Tooltip>
            ) : (
              record?.KCMC
            )}
          </>
        );
      },
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
      title: (
        <span>
          服务课堂&nbsp;
          <Tooltip overlayStyle={{ maxWidth: '30em' }} title={<>已开启班级数/班级总数</>}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
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
              state: {
                type: '1',
                record,
              },
            }}
          >
            <Tooltip title={`已开设${record.fwbj_count}个服务课堂。`}>
              {record.fwbj_count}/{record.allFWBJ_count}
            </Tooltip>
          </Link>
        );
      },
    },
    {
      title: (
        <span>
          缤纷课堂&nbsp;
          <Tooltip overlayStyle={{ maxWidth: '30em' }} title={<>已开班班级数/班级总数</>}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
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
              state: {
                type: '2',
                record,
              },
            }}
          >
            <Tooltip title={`已开设${record.bj_count || 0}个缤纷课堂。`}>
              {record.bj_count || 0}/{record.allBJ_count}
            </Tooltip>
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
      hideInTable: true, // 列表中不显示此列
      render: (_, record) => {
        if (record?.SSJGLX === '机构课程') {
          return <span style={{ color: '#15B628' }}>已引入</span>;
        }
        return record?.KCZT === 0 ? (
          <span style={{ color: '#666' }}>未发布</span>
        ) : (
          <span style={{ color: '#15B628' }}>已发布</span>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      key: 'option',
      width: 280,
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
          {record?.SSJGLX === '机构课程' ? (
            <a
              onClick={() => {
                const obj = { KHKCSJId: '', KCMC: '', id: '' };
                obj.KHKCSJId = record?.id;
                obj.KCMC = record?.KCMC;
                obj.id = record?.KHKCPJs?.[0]?.id;
                getEvaluate(obj);
              }}
            >
              课程评价
            </a>
          ) : (
            ''
          )}

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
                  <label htmlFor="kcly">课程来源：</label>
                  <Select
                    allowClear
                    placeholder="课程来源"
                    onChange={(value) => {
                      setKCLY(value);
                    }}
                    value={KCLY}
                  >
                    <Option value="校内课程" key="校内课程">
                      校内课程
                    </Option>
                    <Option value="机构课程" key="机构课程">
                      机构课程
                    </Option>
                  </Select>
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
          toolBarRender={() => [
            <Button
              style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
              type="primary"
              key="add"
              onClick={() => handleOperation('add')}
            >
              <PlusOutlined />
              新增校内课程
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
          getData={getData}
          visible={open}
          onClose={onClose}
          current={current}
          readonly={readonly}
          kclxOptions={kclxOptions}
          optionsNJ={optionsNJ}
          currentUser={currentUser}
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
        {isModalVisible && (
          <Modal
            footer={
              pjFooter
                ? [
                    <Button key="cancel" onClick={handleCancel}>
                      取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                      确定
                    </Button>,
                  ]
                : [
                    <Button
                      key="edit"
                      onClick={() => {
                        setPjFooter(true);
                      }}
                    >
                      编辑
                    </Button>,
                    <Button key="cancel" type="primary" onClick={handleCancel}>
                      确定
                    </Button>,
                  ]
            }
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            title="课程评价"
          >
            <Form form={form} onFinish={submit} labelCol={{ span: 6 }}>
              <Form.Item name="id" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item hidden name="KHKCSJId" key="KHKCSJId">
                <Input disabled />
              </Form.Item>
              <Form.Item label="课程名称" name="KCMC" key="KCMC">
                <Input disabled bordered={false} />
              </Form.Item>
              {pjFooter ? (
                <Form.Item
                  label="评价内容"
                  name="PY"
                  key="PY"
                  rules={[{ required: true, message: '请输入评价内容' }]}
                >
                  <Input.TextArea placeholder="请输入评价内容" showCount maxLength={200} rows={4} />
                </Form.Item>
              ) : (
                <Form.Item label="评价内容" name="PY" key="PY">
                  <Input.TextArea disabled bordered={false} />
                </Form.Item>
              )}
            </Form>
          </Modal>
        )}
      </div>
    </>
  );
};

export default CourseList;
