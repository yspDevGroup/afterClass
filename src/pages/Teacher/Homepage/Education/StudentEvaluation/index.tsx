import GoBack from "@/components/GoBack";
import { Button, Empty } from "antd";
import styles from './index.less'
import { Link } from "umi";

const StudentEvaluation = (props: any) => {
  const { state } = props.location;
  return <div className={styles.StudentEvaluation}>
    <GoBack title={'学生评价'} />
    {
      state?.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
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
