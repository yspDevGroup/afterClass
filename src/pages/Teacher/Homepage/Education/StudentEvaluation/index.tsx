import GoBack from "@/components/GoBack";
import { Button } from "antd";
import styles from './index.less'
import { Link } from "umi";
import noOrder from '@/assets/noOrder.png';

const StudentEvaluation = (props: any) => {
  const { state } = props.location;
  return <div className={styles.StudentEvaluation}>
    <GoBack title={'学生评价'} teacher onclick='/teacher/home?index=education' />
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
                  <Link key="xq"
                    to={{
                      pathname: '/teacher/education/studentEvaluation/details',
                      state: value
                    }}><Button>去评价</Button> </Link>
              </div>
            })
          }

        </div>
    }

  </div>
}
export default StudentEvaluation;
