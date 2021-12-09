/* eslint-disable no-plusplus */
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';
import { getAllByDate } from '@/services/after-class/khjscq';
import { queryXNXQList } from '@/services/local-services/xnxq';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TopNav from './../components/TopNav'
import styles from './index.less';


const SignInDetails = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [NoSignInTeacher, setNoSignInTeacher] = useState<any>([]);

  const getData = async()=>{
    const result = await queryXNXQList(currentUser?.xxId);
    const res = await getKCBSKSJ({
      XNXQId: result.current?.id,
      startDate: moment(new Date()).format('YYYY-MM-DD')
    })
    if (res.status === 'ok') {
      const newArrs: any = [];
      const JCIdArr: any = [];
      const BJIdArr: any = [];
      const newArr = res.data?.rows?.filter((item: any) => new Date(`${item.SKRQ} ${item.XXSJPZ.KSSJ}`) < new Date());

      newArr?.forEach((value: any) => {
        JCIdArr.push(value.XXSJPZId)
        BJIdArr.push(value.KHBJSJId)
        value.KCBSKJSSJs.forEach((items: any) => {
          const newData = {
            ...items.JZGJBSJ,
            KHBJSJId: value.KHBJSJId,
            KHBJSJ: value.KHBJSJ,
            XXSJPZ: value.XXSJPZ
          }
          newArrs.push(newData)
        })
      })
      const resgetAllByDate = await getAllByDate({
        XXSJPZIds: JCIdArr,
        KHBJSJIds: BJIdArr,
        CQZT: ['出勤', '请假'],
        CQRQ: moment(new Date()).format('YYYY-MM-DD')
      })
      if (resgetAllByDate.status === 'ok') {
        // 筛选出未签到的教师
        const NoSignInArr = [];
        for (let i = 0; i < newArrs.length; i++) {
          const obj = newArrs[i];
          const BJId = obj.KHBJSJId;
          const JSId = obj.id;
          let isExist = false;
          for (let j = 0; j < resgetAllByDate.data.length; j++) {
            const aj = resgetAllByDate.data[j];
            const BJIds = aj.KHBJSJId;
            const JSIds = aj.JZGJBSJId;
            if (BJIds === BJId && JSId === JSIds) {
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            NoSignInArr.push(obj);
          }
        }
        setNoSignInTeacher(NoSignInArr);
      }

    }
  }
  useEffect(() => {
    getData();
  }, [])
  const onclick=()=>{
    getData();
  }
  return (
    <div className={styles.DetailsBox}>
      <TopNav title="未签到教师" state={true} Refresh={true} onclick={onclick} />
      {
        NoSignInTeacher.length === 0 ? <></>:
        <div className={styles.wrap}>
        {
          NoSignInTeacher.map((value: any) => {
            const showWXName = value?.XM === '未知' && value?.WechatUserId;
            return <div className={styles.box}>
              <p><span className={styles.name}>
                {
                  showWXName ? <WWOpenDataCom type="userName" openid={value?.WechatUserId} /> : <>{value?.XM}</>
                }</span>
                <span className={styles.time}>{value?.XXSJPZ.KSSJ.substring(0, 5)}~{value?.XXSJPZ.JSSJ.substring(0, 5)}</span>
              </p>
              <p>
                <span>
                  {
                    value?.KHBJSJ?.BJMC
                  }
                </span>
                <span>
                  {
                    value?.KHBJSJ?.KHKCSJ?.KCMC
                  }
                </span>
              </p>
            </div>
          })
        }
      </div>
      }

    </div>
  );
};

export default SignInDetails;
