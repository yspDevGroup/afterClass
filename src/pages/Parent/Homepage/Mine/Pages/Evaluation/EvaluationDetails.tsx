import GoBack from '@/components/GoBack';
import { createKHBJPJ } from '@/services/after-class/khbjpj';
import { Rate, Input, Button, message } from 'antd';
import { useState } from 'react';
import styles from './index.less';
import { history } from 'umi';


const { TextArea } = Input;


const EvaluationDetails = (props: any) => {
  const { state } = props.location;
  const [Fraction, setFraction] = useState<number>()
  const [Evaluation, setEvaluation] = useState<string>()
  const handleChange = (value: any) => {
    setFraction(value)
  };
  const onChange = (e: any) => {
    setEvaluation(e.target.value)
  };
  const submit = async () => {
    const res = await createKHBJPJ({
      PJFS:Fraction,
      PY:Evaluation,
      XSId:state?.XSId,
      XSXM:state?.XSXM,
      KHBJSJId:state?.KHBJSJId
    })
    if(res.status === 'ok'){
      message.success('评价成功')
      history.go(-1)
    }
  }
  return <div className={styles.EvaluationDetails}>
    <GoBack title={'课程评价'} />
    <div className={styles.header}>
      <img src={state?.KHBJSJ?.KCTP} alt="" />
      <div>
        <p>{state?.KHBJSJ?.KHKCSJ?.KCMC}</p>
        <p>班级：{state?.KHBJSJ?.BJMC}</p>
        <p>任课教师：{state?.KHBJSJ?.KHBJJs?.[0].JSXM}</p>
      </div>
    </div>
    <div className={styles.content}>
      <p>综合评价：<Rate onChange={handleChange} /></p>
      <TextArea placeholder="请输入您的评价" showCount maxLength={200} onChange={onChange} />
    </div>
    <div className={styles.btn}>
      <Button onClick={submit} disabled={false}>提交</Button>
    </div>
  </div>
}

export default EvaluationDetails;
