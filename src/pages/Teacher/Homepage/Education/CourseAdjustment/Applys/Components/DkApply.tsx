/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:14:11
 * @LastEditTime: 2022-04-22 16:41:32
 * @LastEditors: Wu Zhan
 */
import { useEffect, useState } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import { useModel, history } from 'umi';
import ClassCalendar from '../../../ClassCalendar';
import styles from '../index.less';
import { getIgnoreTeacherByClassesId } from '@/services/after-class/jzgjbsj';
import { createKHJSTDK } from '@/services/after-class/khjstdk';
import ShowName from '@/components/ShowName';
import { CreateJSCQBQ } from '@/services/after-class/jscqbq';
import { getQueryString } from '@/utils/utils';

const { TextArea } = Input;
const { Option } = Select;
const DkApply = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const prevDay = getQueryString('date');
  const dealClassId = getQueryString('classId');
  const [JsData, setJsData] = useState<API.JZGJBSJ[]>();
  const [DKJsId, setDKJsId] = useState();
  const [form] = Form.useForm();
  // 课表中选择课程后的数据回显
  const [dateData, setDateData] = useState<any>([]);
  const onSubmit = async () => {
    if (dateData?.day) {
      form.submit();
    } else {
      message.warning('请选择代课课程');
    }
  };
  useEffect(() => {
    (async () => {
      if (dateData) {
        const res = await getIgnoreTeacherByClassesId({
          KHBJSJId: dateData?.bjid,
          XXJBSJId: currentUser?.xxId,
          page: 0,
          pageSize: 0,
        });
        if (res.status === 'ok') {
          setJsData(res.data?.rows);
        }
      } else {
        setJsData([]);
      }
    })();
  }, [dateData]);
  /** 代课补签 */
  const onFinish = async (values: any) => {
    // 处理补签流程问题
    if (prevDay && dealClassId) {
      await CreateJSCQBQ({
        XXJBSJId: currentUser.xxId,
        BQRQ: dateData?.day,
        QKYY: values.QJYY,
        SQNR: '代课',
        BQRId: currentUser.JSId || testTeacherId,
        KHBJSJId: dateData?.bjid,
        XXSJPZId: dateData?.jcId,
        DKRId: DKJsId,
      });
      history.push('/teacher/education/resign');
    } else {
      const newData = {
        LX: 1,
        ZT: 0,
        DKJSId: DKJsId,
        BZ: values.QJYY,
        XXJBSJId: currentUser.xxId,
        SKJSId: currentUser.JSId || testTeacherId,
        SKFJId: dateData?.FJId,
        SKRQ: dateData?.day,
        KHBJSJId: dateData?.bjid,
        SKJCId: dateData?.jcId,
      };
      const res = await createKHJSTDK(newData);
      if (res.status === 'ok') {
        message.success('申请成功');

        setDateData([]);
        form.resetFields();
        history.push('/teacher/education/courseAdjustment');
      } else {
        message.error(res.message);
      }
    }
  };
  const onGenderChange = (value: any, key: any) => {
    setDKJsId(key?.key);
  };
  return (
    <div className={styles.leaveForm}>
      <div className={styles.wrapper}>
        <p className={styles.title}>
          <span>代课时间</span>
        </p>
        <ClassCalendar setDatedata={setDateData} type="dksq" form={form} />
        <Form
          name="basic"
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <div className={styles.verticalTk}>
            <Form.Item
              label="代课教师（请先选择代课课程）"
              name="DKJS"
              rules={[{ required: true, message: '请选择代课教师' }]}
            >
              <Select placeholder="请选择代课教师" onChange={onGenderChange} allowClear showSearch>
                {JsData?.map((value) => {
                  return (
                    <Option value={value.XM} key={value.id}>
                      <ShowName type="userName" openid={value.WechatUserId} XM={value.XM} />
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
          <div className={styles.reasonTk}>
            <Form.Item
              label="代课原因"
              name="QJYY"
              rules={[{ required: true, message: '请输入代课原因!' }]}
            >
              <TextArea rows={4} maxLength={100} placeholder="请输入" />
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className={styles.fixedBtn}>
        <Button
          onClick={() => {
            history.go(-1);
            // history.push('/teacher/education/courseAdjustment');
          }}
        >
          取消
        </Button>
        <Button onClick={onSubmit}>提交</Button>
      </div>
    </div>
  );
};

export default DkApply;
