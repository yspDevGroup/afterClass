import GoBack from "@/components/GoBack";
import { Button, Switch } from "antd";
import styles from './index.less'
import {history} from 'umi';


const Details = () => {
  const onChange = (checked) => {
    console.log(checked);
  }
  const onSubmit = () =>{

  }
  return <div className={styles.Details}>
    <GoBack title={'详情'} teacher />
    <div className={styles.apply}>
      <p className={styles.title}>黄小丫教师的代课申请</p>
      <p>时间：9月29日，15:50—16:50</p>
      <p>地点：教学楼一楼103 </p>
      <p>课程：初中部绘画艺术素描基础课 </p>
      <p>原因：身体不舒服，无法按时上课，申请调课。</p>
    </div>
    <div className={styles.process}>
      <p className={styles.title}>流程</p>
      <div className={styles.processLine}>
        <div className={styles.circular} />
        <div className={styles.Line} />
        <div className={styles.circular} />
      </div>
      <div className={styles.role}>
        <div>
          <p>代课人</p>
          <p>代替授课的老师</p>
        </div>
        <div>姓</div>
      </div>
      <div className={styles.roles}>
        <div>
          <p>审批人</p>
          <p>学校管理员 </p>
        </div>
        <div>姓</div>
      </div>
      <p className={styles.switch}>
      <span>是否同意调课</span>
      <Switch defaultChecked onChange={onChange} />
    </p>
    </div>
    <div className={styles.fixedBtn}>
        <Button onClick={() => {
          history.push('/teacher/education/courseAdjustment')
        }}>取消</Button>
        <Button onClick={onSubmit}>提交</Button>
      </div>
  </div>
}

export default Details;
