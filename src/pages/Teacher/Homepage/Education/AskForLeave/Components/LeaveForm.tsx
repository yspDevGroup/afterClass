/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 11:14:11
 * @LastEditTime: 2021-11-24 15:50:55
 * @LastEditors: Sissle Lynn
 */
import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useModel } from 'umi';
import ClassCalendar from '../../ClassCalendar';
import styles from '../index.less';
import { compareTime } from '@/utils/Timefunction';
import { createKHJSQJ } from '@/services/after-class/khjsqj';
import { getMainTeacher } from '@/services/after-class/khbjsj';
import { getClassDays } from '@/utils/TimeTable';

const { TextArea } = Input;
const LeaveForm = (props: {
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { setActiveKey, setReload } = props;
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
    const res = await createKHJSQJ({
      ...values,
      QJZT: 0,
      KSSJ,
      JSSJ,
      JZGJBSJId: currentUser.JSId || testTeacherId,
      bjIds,
      XXJBSJId: currentUser.xxId,
    });
    if (res.status === 'ok') {
      message.success('提交成功');
      setReload(true);
      setDateData([]);
      form.resetFields();
      setActiveKey('history');
      // 处理自动审批流程时主班请假导致课时变更的问题
      if (res.message === "isAudit=false") {
        const bjIdArr = [].map.call(bjIds, (item: { KHBJSJId: string }) => {
          return item.KHBJSJId;
        });
        const result = await getMainTeacher({
          KHBJSJIds: bjIdArr as string[],
          JZGJBSJId: currentUser.JSId || testTeacherId,
          JSLX: '主教师'
        });
        if (result.status === 'ok') {
          const { data } = result;
          data?.forEach(async (ele: { KHBJSJId: string; }) => {
            await getClassDays(ele.KHBJSJId, currentUser.JSId || testTeacherId, currentUser?.xxId);
          });
        };
      }
    } else {
      const msg = res.message;
      message.error(msg);
    }
  };
  return (
    <div className={styles.leaveForm}>
      <div className={styles.type}>
        <p>
          <span>按课时</span>请假
        </p>
        <p>所选课程相应节次将自动归为请假，计入出勤统计</p>
      </div>
      <div className={styles.wrapper}>
        <ClassCalendar setDatedata={setDateData} type="edit" form={form} />
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item label="QJLX" name="QJLX" hidden={true} initialValue="按课时请假">
            <Input />
          </Form.Item>
          <Form.Item
            label="请假原因"
            name="QJYY"
            rules={[{ required: true, message: '请输入请假原因!' }]}
          >
            <TextArea rows={4} placeholder="请输入" />
          </Form.Item>
        </Form>
      </div>
      <div className={styles.fixedBtn}>
        <Button onClick={onSubmit}>提交</Button>
      </div>
    </div>
  );
};

export default LeaveForm;
