import GoBack from "@/components/GoBack";
import { Empty, Rate } from "antd";
import styles from './index.less'
import { Link } from "umi";
import { RightOutlined } from "@ant-design/icons";

const Feedback = (props: any) => {
  const { state } = props.location;
  return <div className={styles.Feedback}>
    <GoBack title={'课程反馈'} />
    {
      state?.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
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
