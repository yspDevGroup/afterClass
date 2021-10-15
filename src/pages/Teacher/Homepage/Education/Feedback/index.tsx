import GoBack from "@/components/GoBack";
import {Rate } from "antd";
import styles from './index.less'
import { Link } from "umi";
import { RightOutlined } from "@ant-design/icons";
import noOrder from '@/assets/noOrder1.png';

const Feedback = (props: any) => {
  const { state } = props.location;
  return <div className={styles.Feedback}>
    <GoBack title={'课程反馈'} teacher onclick='/teacher/home?index=education' />
    {
      state?.length === 0 ? <div className={styles.ZWSJ}>
      <img src={noOrder} alt="" />
      <p>暂无数据</p>
      </div> :
        <div className={styles.wrap}>
          {
            state?.map((value: any) => {
              return <div className={styles.cards}>
                <p>{value?.KHKCSJ?.KCMC}</p>
                <p>{value?.BJMC}</p>
                <p>
                  <Rate value={Math.round(value.ZHPF)} />
                  <Link key="xq"
                    to={{
                      pathname: '/teacher/education/feedback/details',
                      state: value
                    }}>详情 <RightOutlined /> </Link>
                </p>
              </div>
            })
          }
        </div>
    }

  </div>
}
export default Feedback;
