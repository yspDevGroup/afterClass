import GoBack from "@/components/GoBack";
import {  Rate } from "antd";
import styles from './index.less'
import { useEffect, useState } from "react";
import { getKHBJPJ } from "@/services/after-class/khbjpj";
import { useModel } from "umi";
import { getXXJBSJ } from "@/services/after-class/xxjbsj";
import noOrder from '@/assets/noOrder1.png';

const Details = (props: any) => {
  const { state } = props.location;
  const [Dates, setDates] = useState<any>();
  const [SchoolName, setSchoolName] = useState<any>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  useEffect(() => {
    (async()=>{
      const res = await getKHBJPJ({
        KHBJSJId:state?.id,
        XSJBSJId:'',
        XNXQId: '',
        XXJBSJId:'',
        page:0,
        pageSize:0
      })
      setDates(res.data.rows)
      const resgetXXJBSJ = await getXXJBSJ({
        id:currentUser?.xxId
      })
      setSchoolName(resgetXXJBSJ.data)
    })()
  }, []);
  return <div className={styles.Details}>
    <GoBack title={'详情'} teacher />
    <p className={styles.title}>{state?.KHKCSJ?.KCMC} ｜{state?.BJMC}</p>
    <p className={styles.SchoolName}>{SchoolName?.XXMC}</p>
    {
      Dates?.length === 0 ? <div className={styles.ZWSJ}>
      <img src={noOrder} alt="" />
      <p>暂无数据</p>
      </div> :
      <div className={styles.History}>
              <div>
                {
                  Dates?.map((value: any) => {
                    return <div className={styles.Pjcards}>
                        <p className={styles.name}><span>{value.PJR}</span><Rate value={parseInt(value.PJFS,10)} /></p>
                        <p>{value.createdAt.split(' ')[0]}评价</p>
                        <div className={styles.PY}>{value.PY}</div>
                      </div>
                  })
                }
              </div>
            </div>
    }




  </div>
}
export default Details;
