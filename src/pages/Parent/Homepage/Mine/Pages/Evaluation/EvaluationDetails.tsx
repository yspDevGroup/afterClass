import GoBack from '@/components/GoBack';
import { createKHBJPJ } from '@/services/after-class/khbjpj';
import { Rate, Input, Button, message } from 'antd';
import { useState } from 'react';
import styles from './index.less';
import { history, useModel } from 'umi';
import noPic from '@/assets/noPicBig.png';

const { TextArea } = Input;

const EvaluationDetails = (props: any) => {
  const { state } = props.location;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Fraction, setFraction] = useState<number>();
  const [Evaluation, setEvaluation] = useState<string>();
  const StorageXSId = localStorage.getItem('studentId');
  const StudentName = localStorage.getItem('studentName');
  const handleChange = (value: any) => {
    setFraction(value);
  };
  const onChange = (e: any) => {
    setEvaluation(e.target.value);
  };
  const submit = async () => {
    const { student, external_contact } = currentUser || {};
    const res = await createKHBJPJ({
      PJFS: Fraction,
      PY: Evaluation,
      XSJBSJId: StorageXSId || (student && student[0].XSJBSJId) || testStudentId,
      KHBJSJId: state?.id,
      PJR:
        (external_contact &&
          `${StudentName || (student && student[0].name) || '张三'}${
            external_contact.subscriber_info.remark.split('-')[1]
          }`) ||
        '张三爸爸',
    });
    if (res.status === 'ok') {
      message.success('评价成功');
      history.go(-1);
    }
  };
  return (
    <div className={styles.EvaluationDetails}>
      <GoBack title={'课程评价'} />
      <div className={styles.header}>
        <img src={state?.KHKCSJ?.KCTP || noPic} alt="" />
        <div>
          <p>{state?.KHBJSJ?.KHKCSJ?.KCMC}</p>
          <p>班级：{state?.BJMC}</p>
          <p>任课教师：{state?.KHBJJs?.[0].JZGJBSJ?.XM}</p>
        </div>
      </div>
      <div className={styles.content}>
        <p>
          综合评价：
          <Rate onChange={handleChange} />
        </p>
        <TextArea placeholder="请输入您的评价" showCount maxLength={200} onChange={onChange} />
      </div>
      <div className={styles.btn}>
        <Button onClick={submit} disabled={false}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default EvaluationDetails;
