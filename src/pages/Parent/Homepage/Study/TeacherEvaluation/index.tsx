import GoBack from "@/components/GoBack";
import { Empty, Rate } from "antd";
import styles from './index.less'
import { Link, useModel } from "umi";
import { RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllKHXSPJ } from "@/services/after-class/khxspj";

const TeacherEvaluation = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Datas, setDatas] = useState<any>();
  useEffect(() => {
    const { student } = currentUser || {};
    (
      async()=>{
        const res = await getAllKHXSPJ({
          XSId: student && student.student_userid || '20210901',
          KHBJSJId:"",
          JSId:"",
          XNXQId:"",
          page:0,
          pageSize:0
        })
        setDatas(res.data)
      }
    )()
  }, []);
  return <div className={styles.TeacherEvaluation}>
    <GoBack title={'教师寄语'} />
    {/* {
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
    } */}


  </div>
}
export default TeacherEvaluation;
