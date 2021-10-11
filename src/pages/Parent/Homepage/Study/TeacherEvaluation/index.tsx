import GoBack from "@/components/GoBack";
import { Empty, Rate } from "antd";
import styles from './index.less'
import { useModel } from "umi";
import { useEffect, useState } from "react";
import { getAllKHXSPJ } from "@/services/after-class/khxspj";
import { queryXNXQList } from "@/services/local-services/xnxq";

const TeacherEvaluation = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Datas, setDatas] = useState<any>([]);
  useEffect(() => {
    const { student } = currentUser || {};
    (
      async()=>{
        const result = await queryXNXQList(currentUser?.xxId, undefined);
        const res = await getAllKHXSPJ({
          XSId:localStorage.getItem('studentId') ||  student[0].student_userid || '20210901',
          KHBJSJId:"",
          JSId:"",
          XNXQId:result.current.id,
          page:0,
          pageSize:0
        })
        setDatas(res.data?.rows)
      }
    )()
  }, []);
  return <div className={styles.TeacherEvaluation}>
    <GoBack title={'教师寄语'} />

    {
      Datas?.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
        <div className={styles.wrap}>
          {
            Datas?.map((value: any) => {
              return <div className={styles.cards}>
                <p> <span>{value?.KHJSSJ?.XM}老师</span> <Rate disabled value={value?.PJFS} /></p>
                <p><span>{value?.KHBJSJ?.BJMC} ｜{value?.KHBJSJ?.KHKCSJ?.KCMC}</span> <span>{value?.createdAt?.split(' ')[0]}</span> </p>
                <div className={styles.content}>
                  {value?.PY}
                </div>
              </div>
            })
          }
        </div>
    }


  </div>
}
export default TeacherEvaluation;
