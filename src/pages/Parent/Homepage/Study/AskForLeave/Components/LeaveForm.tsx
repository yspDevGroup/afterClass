/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:14:11
 * @LastEditTime: 2021-09-17 15:19:34
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useModel } from 'umi';
import ClassCalendar from '../../ClassCalendar';

import styles from '../index.less';
import { compareTime } from '@/utils/Timefunction';
import { createKHXSQJ } from '@/services/after-class/khxsqj';

const { TextArea } = Input;
const LeaveForm = (props: {
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
 }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const {setActiveKey,setReload} = props;
  const [reloadList, setReloadList] = useState<boolean>(false);
  const [form] = Form.useForm();
  // 课表中选择课程后的数据回显
  const [dateData, setDateData] = useState<any>([]);
  const onSubmit = async () => {
    if (dateData?.length) {
      form.submit();
    } else {
      message.warning('请选择请假课程');
    }
  };
  const onFinish = async (values: any) => {
    let KSSJ = '00:00';
    let JSSJ = '00:00';
    const bjIds: any[] = [];
    dateData.forEach((ele: any) => {
      KSSJ = compareTime(KSSJ, ele.start);
      JSSJ = compareTime(JSSJ, ele.end);
      bjIds.push({
        KCMC: ele.title,
        QJRQ: ele.day,
        KHBJSJId: ele.bjId
      })
    });
    const res = await createKHXSQJ({
      ...values,
      QJZT:0,
      KSSJ,
      JSSJ,
      XSId: student && student.student_userid || '20210901',
      XSXM: currentUser?.external_contact?.subscriber_info.remark ||
      currentUser?.username,
      bjIds
    });
    if (res.status === 'ok') {
      message.success('提交成功');
      setReload(true);
      setReloadList(true);
      setDateData([]);
      form.resetFields();
      setActiveKey('history');
    } else {
      let msg = res.message;
      message.error(msg);
    }
  };
  return (
    <div className={styles.leaveForm}>
      <div className={styles.type}>
        <p><span>按课时</span>请假</p>
        <p>所选课程相应节次将自动归为请假，计入出勤统计</p>
      </div>
      <div className={styles.wrapper} >
        <ClassCalendar setDatedata={setDateData} type='edit' form={form} reload={reloadList} setReloadList={setReloadList} />
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label="QJLX"
            name="QJLX"
            hidden={true}
            initialValue='按课时请假'
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="请假原因"
            name="QJYY"
            rules={[{ required: true, message: '请输入请假原因!' }]}
          >
            <TextArea rows={4} placeholder='请输入' />
          </Form.Item>
        </Form>
      </div>
      <div className={styles.fixedBtn}>
        <Button onClick={onSubmit}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default LeaveForm;
