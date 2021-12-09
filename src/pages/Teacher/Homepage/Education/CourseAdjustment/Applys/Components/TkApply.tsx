/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:14:11
 * @LastEditTime: 2021-12-09 14:08:31
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, message, Select } from 'antd';
import { useModel, history } from 'umi';
import ClassCalendar from '../../../ClassCalendar';
import styles from '../index.less';
import moment from 'moment';
import { createKHJSTDK } from '@/services/after-class/khjstdk';
import { freeSpace } from '@/services/after-class/fjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import { getClassDays } from '@/utils/TimeTable';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';

const { TextArea } = Input;
const { Option } = Select;
const TkApply = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [FjData, setFjData] = useState<any>();
  const [FieldId, setFieldId] = useState();
  const [NewRQ, setNewRQ] = useState<any>();
  const [NewKSSJ, setNewKSSJ] = useState<string>();
  const [NewJSSJ, setNewJSSJ] = useState<string>();
  const [NewJCId, setNewJCId] = useState<string>();
  const [jcxx, setJcxx] = useState<any[]>();
  const [state, setstate] = useState(true);
  const [form] = Form.useForm();
  // 课表中选择课程后的数据回显
  const [dateData, setDateData] = useState<any>([]);
  const onSubmit = async () => {
    if (dateData?.day) {
      form.submit();
    } else {
      message.warning('请选择调课课程');
    }
  };
  useEffect(() => {
    (
      async () => {
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
              pageSize: 0
            })
            if (result.status === 'ok') {
              setFjData(result.data?.rows)
            }
          }
        } else {
          setFjData([])
        }
      }
    )();
  }, [NewRQ, NewKSSJ, NewJSSJ])
  useEffect(() => {
    (async () => {
      const opt = {
        XXJBSJId: currentUser.xxId,
        type: ["0"],
      };
      const res = await getAllXXSJPZ(opt);
      if (res.status === 'ok' && res.data) {
        setJcxx(res.data);
      }
    })()
  }, [])
  useEffect(() => {
    (
      async () => {
        if (dateData) {
          const result = await getKHBJSJ({
            id: dateData?.bjid
          })
          if (result.status === 'ok') {
            const JSId = result.data.KHBJJs.find((item: any) => item.JSLX === '主教师').JZGJBSJ.id;
            if ((currentUser?.JSId || testTeacherId) === JSId) {
              setstate(false);
            } else {
              message.warning('您不是该班级主班教师')
              setstate(true);
            }
          }
        }
      }
    )()
  }, [dateData]);

  const onFinish = async (values: any) => {
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
      TKJCId: NewJCId
    }
    const res = await createKHJSTDK(newData);
    if (res.status === 'ok') {
      message.success('申请成功');
      setDateData([]);
      form.resetFields();
      // 处理主班调课后课时状态变更的情况，触发课时重新计算
      if (res.message === "isAudit=false") {
        await getClassDays(dateData?.bjid, currentUser.JSId || testTeacherId, currentUser?.xxId);
      }
      history.push('/teacher/education/courseAdjustment');
    } else {
      message.error(res.message)
    }
  };
  const onGenderChange = (value: any, key: any) => {
    setFieldId(key?.key)
  }

  const disabledDate = (current: any) => {
    const day1 = new Date();
    day1.setDate(day1.getDate() - 1);
    return current && moment(current) < moment(day1)
  }

  return (
    <div className={styles.leaveForm}>
      <div className={styles.wrapper}>
        <p className={styles.title}>
          <span>调课时间</span>
        </p>
        <ClassCalendar setDatedata={setDateData} type="tksq" form={form} />
        <div className={styles.Divider}> <span>调课后</span></div>
        {
          dateData?.day ? <p className={styles.YxCourse}>已选课程：{moment(dateData?.day).format('MM月DD日')} ，{dateData?.title}</p> : <></>
        }
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
            <Form.Item name='TKRQ' label="日期">
              <DatePicker
                disabledDate={disabledDate}
                inputReadOnly={true}
                placeholder='请选择'
                onChange={(value) => {
                  if (value) {
                    setNewRQ(value);
                  }
                }} />
            </Form.Item>
          </div>
          <div className={styles.kcbjTk}>
            <Form.Item name='KSSJ' label="节次">
              <Select
                placeholder='请选择'
                allowClear
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
                  return <Option value={value.id} key={value.id}>
                    {value?.TITLE}
                  </Option>
                })}
              </Select>
            </Form.Item>
          </div>
          {NewKSSJ ? <div className={styles.kcbjTk}>
            <Form.Item name='KSSJ' label="上课时间">
              <div>{NewKSSJ} — {NewJSSJ}</div>
            </Form.Item>
          </div> : ''}
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
                {
                  FjData?.map((value: any) => {
                    return <Option value={value.FJMC} key={value.id}>
                      {value?.FJMC}
                    </Option>
                  })
                }
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
        {/* <Form
          name="administrative"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <p className={styles.tkhsj}>调课后时间</p>
          <Form.Item name='TKRQ' label="日期">
            <DatePicker
              disabledDate={disabledDate}
              inputReadOnly={true}
              onChange={(value) => {
                onchange(value, 'TKRQ')
              }} />
          </Form.Item>
          <div className={styles.kcbjTk}>
            <Form.Item name='BJMC' label="课程">
              <Select
                placeholder="请选择调课课程"
                allowClear
                showSearch
              >
                {
                  FjData?.map((value: any) => {
                    return <Option value={value.FJMC} key={value.id}>
                      {value?.FJMC}
                    </Option>
                  })
                }
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            label="调课后课程安排"
            name="TKCD"
          >
            <div className={styles.kcapTk}>
              <span>上课时间：第二节（16：00-17：00）</span>
              <br />
              <span>上课地点：1号教学楼301教室</span>
            </div>
          </Form.Item>
          <Form.Item
            label="调课原因"
            name="BZ"
            rules={[{ required: true, message: '请输入调课原因!' }]}
          >
            <TextArea rows={4} maxLength={100} placeholder="请输入" />
          </Form.Item>
        </Form> */}
      </div>
      <div className={styles.fixedBtn}>
        <Button onClick={() => {
          history.push('/teacher/education/courseAdjustment')
        }}>取消</Button>
        <Button onClick={onSubmit} disabled={state}>提交</Button>
      </div>
    </div>
  );
};

export default TkApply;
