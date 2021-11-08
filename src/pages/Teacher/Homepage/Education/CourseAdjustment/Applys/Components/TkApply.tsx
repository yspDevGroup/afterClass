/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:14:11
 * @LastEditTime: 2021-10-15 10:18:19
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, message, Select, TimePicker } from 'antd';
import { useModel, history } from 'umi';
import ClassCalendar from '../../../ClassCalendar';
import styles from '../index.less';
import moment from 'moment';
import { createKHJSTDK } from '@/services/after-class/khjstdk';
import { freeSpace } from '@/services/after-class/fjsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getKHBJSJ } from '@/services/after-class/khbjsj';

const { TextArea } = Input;
const { Option } = Select;
const TkApply = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [FjData, setFjData] = useState<any>();
  const [FieldId, setFieldId] = useState();
  const [NewRQ, setNewRQ] = useState();
  const [NewKSSJ, setNewKSSJ] = useState();
  const [NewJSSJ, setNewJSSJ] = useState();
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
      async()=>{
        if(NewRQ && NewKSSJ && NewJSSJ){
          const resXNXQ = await queryXNXQList(currentUser?.xxId);
          if (resXNXQ?.current) {
            const result = await freeSpace({
              XXJBSJId: currentUser?.xxId,
              XNXQId:resXNXQ?.current?.id,
              RQ:moment(NewRQ).format('YYYY-MM-DD') || '',
              KSSJ:moment(NewKSSJ).format('HH:mm') || '',
              JSSJ:moment(NewJSSJ).format('HH:mm') || '',
              page: 0,
              pageSize: 0
            })
            if (result.status === 'ok') {
              setFjData(result.data?.rows)
            }
          }
        }else{
          setFjData([])
        }
      }
    )();
  }, [NewRQ,NewKSSJ,NewJSSJ])

  useEffect(() => {
    (
      async () => {
        if(dateData){
          const result = await getKHBJSJ({
            id:dateData?.bjid
          })
          if(result.status === 'ok'){
            const JSId = result.data.KHBJJs.find((item: any) => item.JSLX === '主教师').JZGJBSJ.id;
            if(currentUser?.JSId === JSId){
              setstate(false)
            }else{
              message.warning('您不是该班级主班教师')
              setstate(true)
            }
          }
        }
      }
    )()
  }, [dateData])
  const onchange = (value: any,type: any)=>{
    if(type === 'TKRQ'){
      setNewRQ(value)
    }else if(type === 'KSSJ'){
      setNewKSSJ(value)
    }else if(type === 'JSSJ'){
      setNewJSSJ(value)
    }
  }

  const onFinish = async (values: any) => {
    const newData = {
      LX: 0,
      ZT: 0,
      KSSJ:moment(values.KSSJ).format('HH:mm'),
      JSSJ:moment(values.JSSJ).format('HH:mm'),
      SKRQ:dateData?.day,
      TKRQ:moment(values.TKRQ).format('YYYY-MM-DD') ,
      BZ: values.BZ,
      SKJSId: currentUser.JSId || testTeacherId,
      SKFJId:dateData?.FJId,
      TKFJId:FieldId,
      KHBJSJId: dateData?.bjid,
      XXSJPZId: dateData?.jcId
    }
    const res = await createKHJSTDK(newData);
    if (res.status === 'ok') {
      message.success('申请成功');
      setDateData([]);
      form.resetFields();
      history.push('/teacher/education/courseAdjustment')
    } else {
      message.error(res.message)
    }
  };
  const onGenderChange = (value: any, key: any) => {
    setFieldId(key?.key)
  }
  return (
    <div className={styles.leaveForms}>
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
          <Form.Item name='TKRQ' label="日期">
            <DatePicker onChange={(value)=>{
             onchange(value,'TKRQ')
            }} />
          </Form.Item>
          <div className={styles.TimeInterval}>
          <Form.Item  name='KSSJ' label="时段">
            <TimePicker format="HH:mm" onChange={(value)=>{
             onchange(value,'KSSJ')
            }} />
          </Form.Item>
          <div className={styles.right}>
          <span>-</span>
          <Form.Item  name='JSSJ' >
            <TimePicker format="HH:mm" onChange={(value)=>{
             onchange(value,'JSSJ')
            }} />
          </Form.Item>
          </div>

          </div>

          <Form.Item
            label="调课后场地（请先选择时间）"
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
          <Form.Item
            label="调课原因"
            name="BZ"
            rules={[{ required: true, message: '请输入调课原因!' }]}
          >
            <TextArea rows={4} maxLength={100} placeholder="请输入" />
          </Form.Item>
        </Form>
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
