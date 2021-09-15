/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:14:11
 * @LastEditTime: 2021-09-15 16:36:28
 * @LastEditors: Sissle Lynn
 */
import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useModel } from 'umi';
import { createKHXSQJ } from '@/services/after-class/khxsqj';
import ClassCalendar from '../../ClassCalendar';

import styles from '../index.less';
const { TextArea } = Input;
const LeaveForm = (props: any) => {
  // 从日历中获取的时间
  const [date, setDate] = useState<any>();

  const onSubmit = async () => {
    // const res = await createKHXSQJ({});
    // if (res.status === 'ok') {
    //   message.success('保存成功');
    //   history.push('/basicalSettings/schoolInfo');
    // } else {
    //   let msg = res.message;
    //   message.error(msg);
    // }
  };

  return (
    <div className={styles.leaveForm}>
      <div className={styles.type}>
        <p><span>按课时</span>请假</p>
        <p>所选课程相应节次将自动归为请假，计入出勤统计</p>
      </div>
      <div className={styles.wrapper} >
        <ClassCalendar setDatedata={setDate} type='edit' />
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item
            label="id"
            name="id"
            hidden={true}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="QJLX"
            name="QJLX"
            hidden={true}
          >
            <Input value='按课时请假' />
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
        <Button>
          提交
        </Button>
      </div>
    </div>
  );
};

export default LeaveForm;
