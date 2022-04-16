/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

import { Popconfirm, message, Divider, Modal, Form, Input, Tabs, Button, Badge } from 'antd';

import type { CourseItem } from '../data';
import { enHenceMsg } from '@/utils/utils';
import { getClassDays } from '@/utils/TimeTable';
import {
  cancleClass,
  deleteKHBJSJ,
  getRecordByDate,
  updateKHBJSJ,
} from '@/services/after-class/khbjsj';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';
import { updateKHKCSJ } from '@/services/after-class/khkcsj';
import moment from 'moment';

import { JSInforMation } from '@/components/JSInforMation';

import TeacherSelect from '@/components/TeacherSelect';
import styles from '../index.less';
import ShowName from '@/components/ShowName';
import { changeTeachers } from '@/services/after-class/khbjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import noJF from '@/assets/noJF.png';

type propstype = {
  handleEdit: (data: CourseItem, type?: string) => void;
  record: any;
  getData: (origin?: string | undefined) => Promise<void>;
  type?: string;
};

const { TextArea } = Input;
const { TabPane } = Tabs;
const ActionBar = (props: propstype) => {
  const { handleEdit, record, getData, type } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [JsVisible, setJsVisible] = useState<boolean>(false);
  const [JKVisible, setJKVisible] = useState<boolean>(false);
  // 是否机构课程
  const [isJg, setIsJg] = useState<boolean>(false);
  const [kcId, setKcId] = useState<string | undefined>(undefined);
  const [ZbValues, setZbValues] = useState<string[]>([]);
  const [FbValues, setFbValues] = useState<string[]>([]);
  const [DKQJData, setDKQJData] = useState<any>();
  const [keys, setKeys] = useState<string>();
  const [state, setState] = useState<boolean>(false);
  const [editType, seteditType] = useState<boolean>(false);
  const [Datas, setDatas] = useState<any>();
  const [replaceTeacher, setReplaceTeacher] = useState<any>();

  const shelf = (recorde: any) => {
    if (recorde.xs_count === 0) {
      const res = updateKHBJSJ({ id: recorde.id }, { BJZT: '未开班', BMZT: 0 });
      new Promise((resolve) => {
        resolve(res);
      }).then(async (data: any) => {
        if (data.status === 'ok') {
          message.success(`${type ? '关闭' : '取消'}成功`);
          getData();
          // 取消课程发布
          const { KHKCSJ } = recorde;
          await updateKHKCSJ({ id: KHKCSJ?.id }, { KCZT: 0 });
        } else if (data?.message === '该班级现在有学生数据，不能取消开班') {
          message.warning('该班级存在关联数据，不可关闭');
        } else {
          message.warning(data?.message);
        }
      });
    } else {
      message.warning('有学生报名时，此课程班不能取消开班');
    }
  };
  const JKSubmit = async () => {
    if (record?.id) {
      const res = await updateKHBJSJ({ id: record.id }, { BJZT: '已结课' });
      if (res.status === 'ok') {
        message.success('已结课');
        getData();
      } else {
        message.error(res.message);
      }
    } else {
      message.warning('操作失败');
    }
    setJKVisible(false);
  };

  const release = (records: any) => {
    const res = updateKHBJSJ({ id: records.id }, { BJZT: '已开班' });
    new Promise((resolve) => {
      resolve(res);
    }).then(async (data: any) => {
      if (data.status === 'ok') {
        message.success(`${type ? '开启' : '开班'}成功`);
        getData();
        // 开班成功后获取班级排课信息计算课时安排
        const result = await getKHPKSJByBJID({ id: records.id });
        if (result.status === 'ok' && result.data) {
          await getClassDays(records.id);
        }
        // 开班成功后发布课程
        const { KHKCSJ } = records;
        await updateKHKCSJ({ id: KHKCSJ?.id }, { KCZT: 1 });
      } else {
        message.error(`${type ? '开启' : '开班'}失败，请联系管理员或稍后重试`);
        getData();
      }
    });
  };

  const handleSubmit = async (param: any) => {
    const { MSG } = param;
    try {
      const res = await cancleClass({
        KHBJSJId: record?.id,
        JZGJBSJId: currentUser?.JSId || testTeacherId,
        BZ: '',
        deviceIp: '117.36.118.42',
        MSG,
      });
      if (res.status === 'ok') {
        const result = updateKHBJSJ({ id: record.id }, { BJZT: '未开班', BMZT: 0 });
        if ((await result).status === 'ok') {
          message.success('取消开班成功，课程费用已原路返还');
          getData();
          setVisible(false);
        }
      } else {
        message.warning(res.message);
      }
    } catch (err) {
      message.error('取消开班出现错误，请联系管理员或稍后重试。');
    }
  };

  useEffect(() => {
    // 若原有教师有变更，则将变更的教师放到一个数组里
    const OldTeacher: any[] = [];
    const ChangeTeacher: any[] = [];
    const NewTeacher = ZbValues.concat(FbValues);
    Datas?.KHBJJs?.forEach((value: any) => {
      OldTeacher.push(value?.JZGJBSJ?.id);
    });

    Datas?.KHBJJs?.forEach((item: any) => {
      if (!NewTeacher.find((values: any) => item.JZGJBSJ?.id === values)) {
        ChangeTeacher.push(item);
      }
    });
    setKeys(ChangeTeacher?.[0]?.JZGJBSJ?.id);
    setReplaceTeacher(ChangeTeacher);
  }, [ZbValues, FbValues]);
  useEffect(() => {
    if (keys) {
      (async () => {
        const res = await getRecordByDate({
          KHBJSJId: record?.id,
          startDate: moment(new Date()).format('YYYY-MM-DD'),
          JZGJBSJId: keys,
        });
        if (res?.status === 'ok') {
          setDKQJData(res?.data);
        }
      })();
    }
  }, [keys]);

  switch (record.BJZT) {
    case '未开班':
    case '已取消':
      return (
        <>
          {record.pk_count ? (
            <>
              <a onClick={() => release(record)} style={type ? undefined : { display: 'none' }}>
                开启
              </a>
              <Popconfirm
                title="开班表示该课程班配置已就绪，教育局可见，且可随时开启报名，确定开班？"
                onConfirm={() => release(record)}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a style={type ? { display: 'none' } : undefined}>开班</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => handleEdit(record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => handleEdit(record, 'copy')}>复制</a>
              <Divider type="vertical" />
              <Popconfirm
                title="删除之后，数据不可恢复，确定要删除吗?"
                onConfirm={async () => {
                  try {
                    if (record.id) {
                      const params = { id: record.id };
                      const res = deleteKHBJSJ(params);
                      new Promise((resolve) => {
                        resolve(res);
                      }).then(async (data: any) => {
                        if (data.status === 'ok') {
                          message.success('删除成功');
                          getData();
                          // 取消课程发布
                          const { KHKCSJ } = record;
                          await updateKHKCSJ({ id: KHKCSJ?.id }, { KCZT: 0 });
                        } else {
                          enHenceMsg(data.message);
                        }
                      });
                    }
                  } catch (err) {
                    message.error('删除失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a>删除</a>
              </Popconfirm>
            </>
          ) : (
            <>
              <a onClick={() => handleEdit(record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => handleEdit(record, 'copy')}>复制</a>
              <Divider type="vertical" />
              <Popconfirm
                title="删除之后，数据不可恢复，确定要删除吗?"
                onConfirm={async () => {
                  try {
                    if (record.id) {
                      const params = { id: record.id };
                      const res = deleteKHBJSJ(params);
                      new Promise((resolve) => {
                        resolve(res);
                      }).then((data: any) => {
                        if (data.status === 'ok') {
                          message.success('删除成功');
                          getData();
                        } else {
                          enHenceMsg(data.message);
                        }
                      });
                    }
                  } catch (err) {
                    message.error('删除失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a>删除</a>
              </Popconfirm>
            </>
          )}
        </>
      );
      break;
    case '已开班':
      return (
        <>
          {record?.KKRQ > moment(new Date()).format('YYYY-MM-DD') ? (
            <>
              {record?.xs_count + record.noPayXS_count > 0 &&
              record?.xs_count + record.noPayXS_count < record?.BJRS ? (
                <>
                  <a
                    onClick={() => {
                      if (JSInforMation(currentUser)) {
                        setVisible(true);
                      }
                    }}
                  >
                    取消开班
                  </a>
                  <Modal
                    title="取消开班"
                    visible={visible}
                    onOk={() => {
                      form.submit();
                    }}
                    onCancel={() => {
                      setVisible(false);
                    }}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Form
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 15 }}
                      form={form}
                      initialValues={{
                        MSG: `您所选的${record?.KHKCSJ?.KCMC}-${record?.BJMC}，由于报名人数不足，已关闭该班级；相关课程费用将全额原路返还，请知悉。`,
                      }}
                      onFinish={handleSubmit}
                      layout="horizontal"
                    >
                      <Form.Item
                        label="取消说明"
                        name="MSG"
                        rules={[
                          {
                            required: true,
                            message: '请输入取消说明！',
                          },
                        ]}
                      >
                        <TextArea rows={4} maxLength={200} />
                      </Form.Item>
                    </Form>
                  </Modal>
                </>
              ) : (
                <>
                  <a onClick={() => shelf(record)} style={type ? undefined : { display: 'none' }}>
                    关闭
                  </a>
                  <Popconfirm
                    title="取消后该课程班家长不可见，确定取消开班?"
                    onConfirm={() => shelf(record)}
                    okText="确定"
                    cancelText="取消"
                    placement="topRight"
                  >
                    <a style={type ? { display: 'none' } : undefined}>取消开班</a>
                  </Popconfirm>
                </>
              )}
            </>
          ) : (
            <></>
          )}

          <Divider type="vertical" />
          <a onClick={() => handleEdit(record, 'copy')}>复制</a>
          {record.ISFW === 0 && (
            <>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  setJKVisible(true);
                }}
              >
                结课
              </a>
              <Modal
                title="是否结课"
                visible={JKVisible}
                onOk={() => {
                  JKSubmit();
                }}
                onCancel={() => {
                  setJKVisible(false);
                }}
                okText="确认"
                cancelText="取消"
                width={300}
              >
                <p style={{ color: '#333', fontSize: '16px', marginBottom: '8px' }}>
                  课程名称：{record?.KHKCSJ?.KCMC}{' '}
                </p>
                <p style={{ color: '#333', fontSize: '16px', marginBottom: '8px' }}>
                  课程班名称: {record?.BJMC}
                </p>
                <p style={{ color: '#333', fontSize: '16px', marginBottom: '8px' }}>
                  确定<span style={{ color: '#FF6F6F' }}>结课</span>？
                </p>
              </Modal>
            </>
          )}
          <Divider type="vertical" />
          <>
            <a
              onClick={async () => {
                if (record?.KHKCSJ?.SSJGLX === '机构课程') {
                  setIsJg(true);
                  setKcId(record?.KHKCSJ?.id);
                }
                const ZTeacher: string[] = [];
                const FTeacher: string[] = [];
                record?.KHBJJs?.forEach((item: any) => {
                  if (item?.JSLX === '主教师') {
                    ZTeacher.push(item?.JZGJBSJ?.id);
                  }
                  if (item?.JSLX === '副教师') {
                    FTeacher.push(item?.JZGJBSJ?.id);
                  }
                });
                setZbValues(ZTeacher);
                setFbValues(FTeacher);
                setJsVisible(true);
                setDatas(record);
              }}
            >
              授课教师
            </a>
            <Modal
              title="授课教师"
              visible={JsVisible}
              className={styles.GHTeacher}
              onCancel={() => {
                setJsVisible(false);
                seteditType(false);
                setState(false);
              }}
              footer={[
                <Button
                  type="primary"
                  disabled={editType}
                  onClick={() => {
                    seteditType(true);
                  }}
                >
                  更换教师
                </Button>,
                <>
                  {editType === true ? (
                    <>
                      <Button
                        key="submit"
                        type="primary"
                        onClick={async () => {
                          const ZTeacher =
                            ZbValues && ZbValues?.length
                              ? ZbValues.map((item: any) => {
                                  return {
                                    JSLX: 1,
                                    JZGJBSJId: item,
                                  };
                                })
                              : [];
                          const FTeacher =
                            FbValues && FbValues?.length
                              ? FbValues.map((item: any) => {
                                  return {
                                    JSLX: 0,
                                    JZGJBSJId: item,
                                  };
                                })
                              : [];
                          const AllTeacher = ZTeacher.concat(FTeacher);
                          const result = await queryXNXQList(currentUser?.xxId);
                          const res = await changeTeachers({
                            KHBJSJId: record?.id,
                            XNXQId: result.current?.id,
                            startDate: moment(new Date()).format('YYYY-MM-DD'),
                            JZGJBSJIds: AllTeacher,
                          });
                          if (res.status === 'ok') {
                            message.success('保存成功');
                            setJsVisible(false);
                            seteditType(false);
                            setState(false);
                            await getClassDays(record?.id, ZbValues[0], currentUser?.xxId);
                            getData();
                          } else {
                            message.warning('保存失败');
                          }
                        }}
                      >
                        保存
                      </Button>
                      <Button
                        key="cancel"
                        onClick={() => {
                          setJsVisible(false);
                          seteditType(false);
                          setState(false);
                        }}
                      >
                        取消
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </>,
              ]}
            >
              <div className={styles.TeacherChoice}>
                主班：
                {ZbValues?.length === 0 && !editType ? (
                  <span style={{ marginLeft: '8px' }}>—</span>
                ) : (
                  <TeacherSelect
                    disabled={!editType}
                    value={ZbValues}
                    // isjg true 为机构课程 主班为单选 1 为校内课程 2为校外课程
                    type={isJg ? 2 : 1}
                    multiple={false}
                    xxId={currentUser?.xxId}
                    kcId={isJg ? kcId : undefined}
                    onChange={(value: any) => {
                      setZbValues([value]);
                      setState(true);
                    }}
                  />
                )}
              </div>
              <div className={styles.TeacherChoice}>
                副班：
                {FbValues?.length === 0 && !editType ? (
                  <span style={{ marginLeft: '8px' }}>—</span>
                ) : (
                  <TeacherSelect
                    disabled={!editType}
                    value={FbValues}
                    type={isJg ? 3 : 1}
                    multiple={true}
                    xxId={currentUser?.xxId}
                    kcId={isJg ? kcId : undefined}
                    onChange={(value: any) => {
                      if (value?.length <= 3) {
                        setFbValues(value);
                        setState(true);
                      }
                    }}
                  />
                )}
              </div>
              {state === true && replaceTeacher?.length ? (
                <div className={styles.wrap}>
                  <p>
                    更换授课教师后，将清除原有教师当前日期之后与本班级相关的所有信息，包含该教师已有的代课、请假。
                  </p>
                  <Tabs
                    activeKey={keys}
                    onChange={(key) => {
                      setKeys(key);
                    }}
                  >
                    {replaceTeacher?.map((item: any) => {
                      return (
                        <TabPane
                          tab={
                            <>
                              <ShowName
                                type="userName"
                                openid={item?.JZGJBSJ?.WechatUserId}
                                XM={item?.JZGJBSJ?.XM}
                              />
                            </>
                          }
                          // eslint-disable-next-line react/no-array-index-key
                          key={item?.JZGJBSJ?.id}
                        >
                          {DKQJData?.dks?.length === 0 && DKQJData?.qjs?.length === 0 ? (
                            <div className={styles.noJF}>
                              <img src={noJF} alt="" />
                              <p>该教师无代课或请假</p>
                            </div>
                          ) : (
                            <>
                              {DKQJData?.dks?.length ? (
                                <div className={styles.box}>
                                  代课：
                                  {DKQJData?.dks.map((value: any) => {
                                    return (
                                      <p>
                                        <Badge color="#666" />
                                        {value?.SKRQ} {value?.SKJC?.KSSJ.substring(0, 5)} -{' '}
                                        {value?.SKJC?.JSSJ.substring(0, 5)}
                                      </p>
                                    );
                                  })}
                                </div>
                              ) : (
                                <></>
                              )}

                              {DKQJData?.qjs?.length ? (
                                <div className={styles.box}>
                                  请假：
                                  {DKQJData?.qjs.map((value: any) => {
                                    return (
                                      <p>
                                        <Badge color="#666" />
                                        {value?.KHJSQJKCs?.[0]?.QJRQ} {value?.KSSJ} - {value?.JSSJ}
                                      </p>
                                    );
                                  })}
                                </div>
                              ) : (
                                <></>
                              )}
                            </>
                          )}
                        </TabPane>
                      );
                    })}
                  </Tabs>
                </div>
              ) : (
                <></>
              )}
            </Modal>
          </>
        </>
      );
      break;
    // case'已结课':''
    default:
      return (
        <>
          <a onClick={() => handleEdit(record, 'copy')}>复制</a>
        </>
      );
  }
};
export default ActionBar;
