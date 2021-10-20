/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:14:11
 * @LastEditTime: 2021-10-15 10:18:19
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import { useModel, history } from 'umi';
import ClassCalendar from '../../../ClassCalendar';
import styles from '../index.less';
import { compareTime } from '@/utils/Timefunction';
import { getAllJZGJBSJ } from '@/services/after-class/jzgjbsj';
import WWOpenDataCom from '@/components/WWOpenDataCom';

const { TextArea } = Input;
const { Option } = Select;
const DkApply = (props: {
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { setActiveKey } = props;
  const [JsData, setJsData] = useState<API.JZGJBSJ[]>();
  const [JsId, setJsId] = useState();
  const [form] = Form.useForm();
  // 课表中选择课程后的数据回显
  const [dateData, setDateData] = useState<any>([]);
  console.log(dateData, '=========')
  const onSubmit = async () => {
    if (dateData?.length) {
      form.submit();
    } else {
      message.warning('请选择代课课程');
    }
  };
  useEffect(() => {
    (
      async()=>{
        const res = await getAllJZGJBSJ({
          XXJBSJId:currentUser?.xxId,
          page:0,
          pageSize:0
        })
        if(res.status === 'ok'){
          setJsData(res.data?.rows)
        }
      }
    )()
  }, [])
  const onFinish = async (values: any) => {
    let KSSJ = '23:59';
    let JSSJ = '00:00';
    const bjIds: any[] = [];
    dateData.forEach((ele: any) => {
      KSSJ = compareTime(KSSJ, ele.start, 'small');
      JSSJ = compareTime(JSSJ, ele.end, 'large');
      bjIds.push({
        KCMC: ele.title,
        QJRQ: ele.day,
        KHBJSJId: ele.bjid,
        XXSJPZId: ele.jcId,
      });
    });
    // const res = await createKHJSQJ({
    //   ...values,
    //   QJZT: 0,
    //   KSSJ,
    //   JSSJ,
    //   JZGJBSJId: currentUser.JSId || testTeacherId,
    //   bjIds,
    // });
    // console.log(res, '========')
    // if (res.status === 'ok') {
    //   message.success('提交成功');
    //   setDateData([]);
    //   form.resetFields();
    //   setActiveKey('history');
    // } else {
    //   const msg = res.message;
    //   message.error(msg);
    // }
  };
  const onGenderChange = (value: any,key: any) =>{
    setJsId(key?.key)
  }
  return (
    <div className={styles.leaveForm}>

      <div className={styles.wrapper}>
        <p className={styles.title}>
          <span>代课时间</span>
        </p>
        <ClassCalendar setDatedata={setDateData} type="dksq" form={form} />
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label="代课教师"
            name="DKJS"
            rules={[{ required: true, message: '请选择代课教师' }]}
          >
            <Select
              placeholder="请选择代课教师"
              onChange={onGenderChange}
              allowClear
              showSearch
            >
              {
                JsData?.map((value)=>{
                  const showWXName = value?.XM === '未知' && value?.WechatUserId;
                  return  <Option value={value.XM} key={value.id}>
                    {
                      showWXName ? <WWOpenDataCom type="userName" openid={value!.WechatUserId!} />:
                      <>{value.XM}</>
                    }
                  </Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="代课原因"
            name="QJYY"
            rules={[{ required: true, message: '请输入代课原因!' }]}
          >
            <TextArea rows={4}  maxLength={100} placeholder="请输入" />
          </Form.Item>
        </Form>
      </div>
      <div className={styles.fixedBtn}>
        <Button onClick={() => {
          history.push('/teacher/education/courseAdjustment')
        }}>取消</Button>
        <Button onClick={onSubmit}>提交</Button>
      </div>
    </div>
  );
};

export default DkApply;
