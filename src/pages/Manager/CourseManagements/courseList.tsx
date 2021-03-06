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
  // ??????????????????
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // ????????????
  const [kclxOptions, setOptions] = useState<any[]>([]);
  // ???????????????????????????
  const [KCName, setKCName] = useState<string>();
  const [JGName, setJGName] = useState<string>();
  const [KCLXId, setKCLXId] = useState<string>();
  const [KCLY, setKCLY] = useState<string>();
  // ????????????
  const [optionsNJ, setOptionsNJ] = useState<any[]>([]);
  // ??????????????????
  const [visibleMechanismInfo, setVisibleMechanismInfo] = useState(false);
  // ??????????????????
  const [visibleSchoolInfo, setVisibleSchoolInfo] = useState(false);
  // ????????????
  const [info, setInfo] = useState({});
  const [readonly, setReadonly] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [pjFooter, setPjFooter] = useState<boolean>(true);
  // ?????????????????????
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
    // ????????????
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
    // ????????????
    const resNJ = getAllGrades({ XD: currentUser?.XD?.split(',') });
    Promise.resolve(resNJ).then((data) => {
      if (data.status === 'ok') {
        const optNJ: any[] = [];
        const nj = ['?????????', '??????', '??????', '??????'];
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
    // ????????????????????????
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
      if (data.SSJGLX === '????????????') {
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
  // ?????????????????????????????????
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleOk = () => {
    form.submit();
  };
  // ??????????????????
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
        message.success('????????????');
        setIsModalVisible(false);
        // ????????????
        getData();
      }
    } else {
      const res = await createKHKCPJ({
        ...value,
        XXJBSJId: currentUser.xxId,
      });
      if (res.status === 'ok') {
        message.success('????????????');
        setIsModalVisible(false);
        // ????????????
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
  /** ?????? */
  const funOption = (record: any, action: ProCoreActionType) => {
    if (record.SSJGLX === '????????????') {
      return (
        <>
          <a
            onClick={() => {
              handleJgxq(record.KHJYJGId);
            }}
          >
            ????????????
          </a>
          <a
            onClick={() => {
              Modal.confirm({
                title: `????????????????????? ??? ${record.KCMC} ??? ??????`,
                icon: <ExclamationCircleOutlined />,
                content: '????????????????????????????????????????????????',
                okText: '??????',
                cancelText: '??????',
                onOk() {
                  const res = updateKHKCSQ({ id: record?.KHKCSQs?.[0].id }, { ZT: 3 });
                  Promise.resolve(res).then((data) => {
                    if (data.status === 'ok') {
                      message.success('????????????');
                      getData();
                    } else {
                      message.error(data.message);
                    }
                  });
                },
              });
            }}
          >
            ????????????
          </a>
        </>
      );
    }
    return (
      <>
        {record.KCZT === 0 ? (
          <>
            <a onClick={() => handleOperation('add', record)}>??????</a>
            <a onClick={() => handleOperation('copy', record)}>??????</a>
            <Popconfirm
              title={`??????????????? ???${record?.KCMC}??? ????`}
              onConfirm={async () => {
                const res = await deleteKHKCSJ({ id: record?.id });
                if (res.status === 'ok') {
                  message.success('????????????');
                  getData();
                  actionRef?.current?.reloadAndRest?.();
                } else {
                  message.error(res.message);
                }
              }}
            >
              <a>??????</a>
            </Popconfirm>
          </>
        ) : (
          ''
          //   <Popconfirm
          //     title="????????????????????????????????????????????????????????????????????????"
          //     onConfirm={async () => {
          //       const res = await updateKHKCSJ({ id: record?.id }, { KCZT: 0 });
          //       if (res.status === 'ok') {
          //         message.success('????????????');
          //         getData();
          //       } else {
          //         message.error(res.message || '????????????');
          //       }
          //     }}
          //   >
          //     <a>????????????</a>
          //   </Popconfirm>
        )}
      </>
    );
  };
  const columns: ProColumns<any>[] = [
    {
      title: '??????',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 58,
      fixed: 'left',
    },
    {
      title: '????????????',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
      ellipsis: true,
      fixed: 'left',
      render: (_, record) => {
        return (
          <>
            {record?.SSJGLX === '????????????' && record?.KCZT !== 2 ? (
              <Tooltip
                title="??????????????????????????????????????????????????????????????????"
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
      title: '????????????',
      align: 'center',
      width: 150,
      key: 'SSJGLX',
      dataIndex: 'SSJGLX',
      valueType: 'select',
      valueEnum: {
        ????????????: { text: '????????????' },
        ????????????: { text: '????????????' },
      },
      render: (_, record) => {
        return <>{record?.KHJYJG?.QYMC || '????????????'}</>;
      },
    },
    {
      title: '????????????',
      align: 'center',
      width: 0,
      key: 'JGMC',
      dataIndex: 'JGMC',
      hideInTable: true, // ????????????????????????
      render: (_, record) => {
        return <>{record?.KHJYJG?.QYMC || '-'}</>;
      },
    },
    {
      title: '????????????',
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
      title: '????????????',
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
          ????????????&nbsp;
          <Tooltip overlayStyle={{ maxWidth: '30em' }} title={<>??????????????????/????????????</>}>
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
            <Tooltip title={`?????????${record.fwbj_count}??????????????????`}>
              {record.fwbj_count}/{record.allFWBJ_count}
            </Tooltip>
          </Link>
        );
      },
    },
    {
      title: (
        <span>
          ????????????&nbsp;
          <Tooltip overlayStyle={{ maxWidth: '30em' }} title={<>??????????????????/????????????</>}>
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
            <Tooltip title={`?????????${record.bj_count || 0}??????????????????`}>
              {record.bj_count || 0}/{record.allBJ_count}
            </Tooltip>
          </Link>
        );
      },
    },
    {
      title: (
        <span>
          ??????&nbsp;
          <Tooltip
            overlayStyle={{ maxWidth: '30em' }}
            title={
              <>
                <Row>
                  <Col flex="4em" style={{ fontWeight: 'bold' }}>
                    ????????????
                  </Col>
                  <Col flex="auto">????????????????????????</Col>
                </Row>
                <Row>
                  <Col flex="4em" style={{ fontWeight: 'bold' }}>
                    ????????????
                  </Col>
                  <Col flex="auto">????????????????????????????????????????????????????????????</Col>
                </Row>
                <Row>
                  <Col flex="4em" style={{ fontWeight: 'bold' }}>
                    ????????????
                  </Col>
                  <Col flex="auto">???????????????????????????????????????????????????????????????</Col>
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
      hideInTable: true, // ????????????????????????
      render: (_, record) => {
        if (record?.SSJGLX === '????????????') {
          return <span style={{ color: '#15B628' }}>?????????</span>;
        }
        return record?.KCZT === 0 ? (
          <span style={{ color: '#666' }}>?????????</span>
        ) : (
          <span style={{ color: '#15B628' }}>?????????</span>
        );
      },
    },
    {
      title: '??????',
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
            ????????????
          </a>
          {record?.SSJGLX === '????????????' ? (
            <a
              onClick={() => {
                const obj = { KHKCSJId: '', KCMC: '', id: '' };
                obj.KHKCSJId = record?.id;
                obj.KCMC = record?.KCMC;
                obj.id = record?.KHKCPJs?.[0]?.id;
                getEvaluate(obj);
              }}
            >
              ????????????
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
                  <label htmlFor="kcname">???????????????</label>
                  <Search
                    placeholder="????????????"
                    allowClear
                    onSearch={(value: string) => {
                      setKCName(value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="jgname">???????????????</label>
                  <Search
                    placeholder="????????????"
                    allowClear
                    onSearch={(value: string) => {
                      setJGName(value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="kcly">???????????????</label>
                  <Select
                    allowClear
                    placeholder="????????????"
                    onChange={(value) => {
                      setKCLY(value);
                    }}
                    value={KCLY}
                  >
                    <Option value="????????????" key="????????????">
                      ????????????
                    </Option>
                    <Option value="????????????" key="????????????">
                      ????????????
                    </Option>
                  </Select>
                </div>
                <div>
                  <label htmlFor="kctype">???????????????</label>
                  <Select
                    allowClear
                    placeholder="????????????"
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
              ??????????????????
            </Button>,
          ]}
        />
        <MechanismInfo // ???????????????
          onMechanismInfoClose={() => {
            setVisibleMechanismInfo(false);
          }}
          visibleMechanismInfo={visibleMechanismInfo}
          info={info}
        />
        <CourseInfo // ???????????????
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
          title="??????????????????"
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
        {/* ???????????????????????? */}
        {isModalVisible && (
          <Modal
            footer={
              pjFooter
                ? [
                    <Button key="cancel" onClick={handleCancel}>
                      ??????
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                      ??????
                    </Button>,
                  ]
                : [
                    <Button
                      key="edit"
                      onClick={() => {
                        setPjFooter(true);
                      }}
                    >
                      ??????
                    </Button>,
                    <Button key="cancel" type="primary" onClick={handleCancel}>
                      ??????
                    </Button>,
                  ]
            }
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            title="????????????"
          >
            <Form form={form} onFinish={submit} labelCol={{ span: 6 }}>
              <Form.Item name="id" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item hidden name="KHKCSJId" key="KHKCSJId">
                <Input disabled />
              </Form.Item>
              <Form.Item label="????????????" name="KCMC" key="KCMC">
                <Input disabled bordered={false} />
              </Form.Item>
              {pjFooter ? (
                <Form.Item
                  label="????????????"
                  name="PY"
                  key="PY"
                  rules={[{ required: true, message: '?????????????????????' }]}
                >
                  <Input.TextArea placeholder="?????????????????????" showCount maxLength={200} rows={4} />
                </Form.Item>
              ) : (
                <Form.Item label="????????????" name="PY" key="PY">
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
