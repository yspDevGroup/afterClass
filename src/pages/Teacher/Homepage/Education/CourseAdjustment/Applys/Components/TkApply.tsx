/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:14:11
 * @LastEditTime: 2021-12-20 15:49:26
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, message, Radio, Select, Tabs } from 'antd';
import { useModel, history } from 'umi';
import ClassCalendar from '../../../ClassCalendar';
import styles from '../index.less';
import moment from 'moment';
import { getClassDays } from '@/utils/TimeTable';
import { createKHJSTDK } from '@/services/after-class/khjstdk';
import { freeSpace } from '@/services/after-class/fjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getKHBJSJ, getExchengeableClasses } from '@/services/after-class/khbjsj';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';
import forbitImg from '@/assets/403.png';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const TkApply = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [termId, setTermId] = useState<string>();
  const [FjData, setFjData] = useState<any>();
  const [FieldId, setFieldId] = useState();
  const [NewRQ, setNewRQ] = useState<any>();
  const [NewKSSJ, setNewKSSJ] = useState<string>();
  const [NewJSSJ, setNewJSSJ] = useState<string>();
  const [NewJCId, setNewJCId] = useState<string>();
  const [jcxx, setJcxx] = useState<any[]>();
  const [state, setstate] = useState(true);
  const [TKType, setTKType] = useState(false);
  const [curType, setCurType] = useState('1');
  const [adminClass, setAdminClass] = useState<any[]>();
  const [timeList, setTimeList] = useState<any[]>();
  const [form] = Form.useForm();
  const [adminForm] = Form.useForm();
  // 课表中选择课程后的数据回显
  const [dateData, setDateData] = useState<any>([]);
  const onSubmit = async () => {
    if (dateData?.day) {
      if (curType === '1') {
        form.submit();
      }
      if (curType === '2') {
        adminForm.submit();
      }
    } else {
      message.warning('请选择调课课程');
    }
  };
  useEffect(() => {
    (async () => {
      if (NewRQ && NewKSSJ && NewJSSJ) {
        const resXNXQ = await queryXNXQList(currentUser?.xxId);
        if (resXNXQ?.current) {
          const result = await freeSpace({
            XXJBSJId: currentUser?.xxId,
            XNXQId: resXNXQ?.current?.id,
            RQ: moment(NewRQ).format('YYYY-MM-DD') || '',
            KSSJ: NewKSSJ || '',
            JSSJ: NewJSSJ || '',
            page: 0,
            pageSize: 0,
          });
          if (result.status === 'ok') {
            setFjData(result.data?.rows);
          }
        }
      } else {
        setFjData([]);
      }
    })();
  }, [NewRQ, NewKSSJ, NewJSSJ]);
  useEffect(() => {
    (async () => {

      const oriData = await ParentHomeData(
        'teacher',
        currentUser?.xxId,
        currentUser.JSId || testTeacherId,
      );
      const { xnxqId } = oriData.data;
      setTermId(xnxqId);
      if(xnxqId){
        const opt = {
          XNXQId: xnxqId,
          XXJBSJId: currentUser.xxId,
          type: ['0'],
        };
        const res = await getAllXXSJPZ(opt);
        if (res.status === 'ok' && res.data) {
          setJcxx(res.data);
        }
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (dateData) {
        const result = await getKHBJSJ({
          id: dateData?.bjid,
        });
        if (result.status === 'ok') {
          const JSId = result.data.KHBJJs.find((item: any) => item.JSLX === '主教师').JZGJBSJ.id;
          if ((currentUser?.JSId || testTeacherId) === JSId) {
            setstate(false);
            if (dateData.classType === 1) {
              setTKType(true);
            } else {
              setTKType(false);
            }
          } else {
            message.warning('您不是该班级主班教师');
            setstate(true);
          }
        }
      }
    })();
  }, [dateData]);
  const onFinish = async (values: any) => {
    if (values.TKRQ && NewJCId) {
      const newData = {
        LX: 0,
        ZT: 0,
        SKRQ: dateData?.day,
        TKRQ: moment(values.TKRQ).format('YYYY-MM-DD'),
        BZ: values.BZ,
        XXJBSJId: currentUser.xxId,
        SKJSId: currentUser.JSId || testTeacherId,
        SKFJId: dateData?.FJId,
        TKFJId: FieldId,
        KHBJSJId: dateData?.bjid,
        SKJCId: dateData?.jcId,
        TKJCId: NewJCId,
      };
      const res = await createKHJSTDK(newData);
      if (res.status === 'ok') {
        message.success('申请成功');
        setDateData([]);
        form.resetFields();
        // 处理主班调课后课时状态变更的情况，触发课时重新计算
        if (res.message === 'isAudit=false') {
          await getClassDays(dateData?.bjid, currentUser.JSId || testTeacherId, currentUser?.xxId);
        }
        history.push('/teacher/education/courseAdjustment');
      } else {
        message.error(res.message);
      }
    } else {
      message.warning('请选择调课时间');
    }
  };
  const onAdminFinish = async (values: any) => {
    const { TKXX, BJId } = values;
    const newData = {
      LX: 2,
      ZT: 0,
      SKRQ: dateData?.day,
      TKRQ: moment(values.TKRQ).format('YYYY-MM-DD'),
      BZ: values.BZ,
      XXJBSJId: currentUser.xxId,
      DKJSId: TKXX?.teacherId,
      SKJSId: currentUser.JSId || testTeacherId,
      SKFJId: dateData?.FJId,
      TKFJId: TKXX?.FJSJ?.id,
      KHBJSJId: dateData?.bjid,
      SKJCId: dateData?.jcId,
      TKJCId: TKXX?.XXSJPZId,
      DESKHBJSJId: BJId,
    };
    const res = await createKHJSTDK(newData);
    if (res.status === 'ok') {
      message.success('申请成功');
      setDateData([]);
      form.resetFields();
      // 处理主班调课后课时状态变更的情况，触发课时重新计算
      if (res.message === 'isAudit=false') {
        await getClassDays(dateData?.bjid, currentUser.JSId || testTeacherId, currentUser?.xxId);
        await getClassDays(BJId, TKXX?.teacherId, currentUser?.xxId, 'exchange');
      }
      history.push('/teacher/education/courseAdjustment');
    } else {
      message.error(res.message);
    }
  };
  const onGenderChange = (value: any, key: any) => {
    setFieldId(key?.key);
  };
  const disabledDate = (current: any) => {
    const day1 = new Date();
    day1.setDate(day1.getDate() - 1);
    return current && moment(current) < moment(day1);
  };
  const getAdminClass = async (value: moment.Moment) => {
    const res = await getExchengeableClasses({
      RQ: moment(value).format('YYYY-MM-DD'),
      XNXQId: termId || '',
      KHBJSJId: dateData.bjid,
    });
    if (res.status === 'ok' && res.data) {
      const newList = [].map.call(res.data, (v: any) => {
        return {
          day: moment(value).format('YYYY-MM-DD'),
          classType: v.BJLX,
          bjid: v.id,
          title: v.KHKCSJ.KCMC,
          bjmc: v.BJMC,
        };
      });
      setAdminClass(newList);
    }
  };

  return (
    <div className={styles.leaveForm}>
      <div className={styles.wrapper}>
        <p className={styles.title}>
          <span>调课时间</span>
        </p>
        <ClassCalendar setDatedata={setDateData} type="tksq" form={form} />
        <div className={styles.Divider}>
          {' '}
          <span>调课后</span>
        </div>
        {dateData?.day ? (
          <p className={styles.YxCourse}>
            已选课程：{moment(dateData?.day).format('MM月DD日')} ，{dateData?.title}
          </p>
        ) : (
          <></>
        )}
        <Tabs
          activeKey={curType}
          className={styles.arrangeTab}
          onChange={(key: string) => setCurType(key)}
        >
          <TabPane tab="自由调课" key="1">
            <p>选择时间与场地进行调课</p>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              autoComplete="off"
              form={form}
              onFinish={onFinish}
            >
              <p className={styles.tkhsj}>调课后时间</p>
              <div className={styles.kcbjTk}>
                <Form.Item name="TKRQ" label="日期">
                  <DatePicker
                    disabledDate={disabledDate}
                    inputReadOnly={true}
                    placeholder="请选择"
                    onChange={(value) => {
                      if (value) {
                        setNewRQ(value);
                      }
                    }}
                  />
                </Form.Item>
              </div>
              <div className={styles.kcbjTk}>
                <Form.Item name="KSSJ" label="节次">
                  <Select
                    placeholder="请选择"
                    onChange={(value: string) => {
                      if (value) {
                        setNewJCId(value);
                        const curJc = jcxx?.find((v) => v.id === value);
                        if (curJc) {
                          setNewKSSJ(curJc.KSSJ?.substring(0, 5));
                          setNewJSSJ(curJc.JSSJ?.substring(0, 5));
                        }
                      }
                    }}
                  >
                    {jcxx?.map((value: any) => {
                      return (
                        <Option value={value.id} key={value.id}>
                          {value?.TITLE}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
              {NewKSSJ ? (
                <div className={styles.kcbjTk}>
                  <Form.Item name="KSSJ" label="上课时间">
                    <div>
                      {NewKSSJ} — {NewJSSJ}
                    </div>
                  </Form.Item>
                </div>
              ) : (
                ''
              )}
              <div className={styles.verticalTk}>
                <Form.Item
                  label="调课后场地（请先选择调课日期与节次）"
                  name="TKCD"
                  rules={[{ required: true, message: '请选择调课后场地' }]}
                >
                  <Select
                    placeholder="请选择调课后场地"
                    onChange={onGenderChange}
                    allowClear
                    showSearch
                  >
                    {FjData?.map((value: any) => {
                      return (
                        <Option value={value.FJMC} key={value.id}>
                          {value?.FJMC}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
              <div className={styles.reasonTk}>
                <Form.Item
                  label="调课原因"
                  name="BZ"
                  rules={[{ required: true, message: '请输入调课原因!' }]}
                >
                  <TextArea rows={4} maxLength={100} placeholder="请输入" />
                </Form.Item>
              </div>
            </Form>
          </TabPane>
          <TabPane tab="课程对调" key="2">
            <p>选择本班其他课程进行对调</p>
            {TKType ? (
              <Form
                name="administrative"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                form={adminForm}
                autoComplete="off"
                onFinish={onAdminFinish}
              >
                <p className={styles.tkhsj}>调课后时间</p>
                <div className={styles.kcbjTk}>
                  <Form.Item name="TKRQ" label="日期">
                    <DatePicker
                      disabledDate={disabledDate}
                      inputReadOnly={true}
                      onChange={(value) => {
                        if (value) {
                          setNewRQ(value);
                          getAdminClass(value);
                        }
                      }}
                    />
                  </Form.Item>
                </div>
                <div className={styles.kcbjTk}>
                  <Form.Item
                    name="BJId"
                    label="课程"
                    rules={[{ required: true, message: '请选择调课课程!' }]}
                  >
                    <Select
                      placeholder="请选择调课课程"
                      allowClear
                      onChange={async (e: string) => {
                        if (e) {
                          const res = await getKCBSKSJ({
                            KHBJSJId: [e.toString()],
                            startDate: moment(NewRQ).format('YYYY-MM-DD'),
                          });
                          if (res.status === 'ok' && res.data) {
                            const newList = [].map.call(res.data.rows, (v: any) => {
                              const { KCBSKJSSJs, XXSJPZ, XXSJPZId, FJSJ } = v;
                              const mainTeacher = KCBSKJSSJs.find(
                                (val: { JSLX: number }) => val.JSLX === 1,
                              );
                              return {
                                teacherId: mainTeacher?.JZGJBSJ?.id,
                                XXSJPZ,
                                FJSJ,
                                XXSJPZId,
                              };
                            });
                            setTimeList(newList);
                          }
                        }
                      }}
                    >
                      {adminClass?.map((value: any) => {
                        return (
                          <Option value={value.bjid} key={value.bjid}>
                            {value?.title}-{value.bjmc}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
                {timeList?.length ? (
                  <Form.Item
                    label="调课后课程安排"
                    name="TKXX"
                    rules={[{ required: true, message: '请选择调课后课程安排!' }]}
                  >
                    <Radio.Group style={{ width: `100%` }}>
                      {timeList?.map((item) => {
                        const { XXSJPZ, FJSJ } = item;
                        return (
                          <div className={styles.kcapTk}>
                            <Radio value={item}>
                              <p>
                                上课时间：{XXSJPZ?.TITLE}（{XXSJPZ?.KSSJ?.substring(0, 5)}-
                                {XXSJPZ?.JSSJ?.substring(0, 5)}）
                              </p>
                              <p>上课地点：{FJSJ.FJMC}</p>
                            </Radio>
                          </div>
                        );
                      })}
                    </Radio.Group>
                  </Form.Item>
                ) : (
                  ''
                )}
                <div className={styles.reasonTk}>
                  <Form.Item
                    label="调课原因"
                    name="BZ"
                    rules={[{ required: true, message: '请输入调课原因!' }]}
                  >
                    <TextArea rows={4} maxLength={100} placeholder="请输入" />
                  </Form.Item>
                </div>
              </Form>
            ) : (
              <div className={styles.forbitTk}>
                <img src={forbitImg} />
                <p>
                  课程对调仅支持已指定行政班级的课程进行调换，有且仅限于同一行政班内的课程班进行调换
                </p>
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
      <div className={styles.fixedBtn}>
        <Button
          onClick={() => {
            history.push('/teacher/education/courseAdjustment');
          }}
        >
          取消
        </Button>
        <Button onClick={onSubmit} disabled={state}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default TkApply;
