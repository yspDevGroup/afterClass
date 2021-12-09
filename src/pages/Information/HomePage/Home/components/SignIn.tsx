/* eslint-disable no-plusplus */
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';
import { getAllByDate } from '@/services/after-class/khjscq';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { Col, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import styles from '../index.less';

const SignIn = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [JsName, setJsName] = useState([]);
  const [NoSignInTeacher, setNoSignInTeacher] = useState<any>([]);
  useEffect(() => {
    (
      async () => {
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

          newArr.forEach((value: any) => {
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
          setJsName(newArrs)
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
    )()
  }, [])
  return <div className={styles.SignIn}>
    <p className={styles.title}>教师实时签到</p>
    <div className={styles.wrap}>
      <p><span>应到教师数</span><span><span>{JsName?.length || '0'}</span>人</span></p>
      <p><span>未签到教师数</span><span><span>{NoSignInTeacher?.length || '0'}</span>人</span></p>
      <Row gutter={[8, 16]}>
        {
          NoSignInTeacher?.map((values: any, index: number) => {
            const showWXName = values?.XM === '未知' && values?.WechatUserId;
            if (index < 12) {
              return <Col span={6} >
                {
                  showWXName ? <WWOpenDataCom type="userName" openid={values?.WechatUserId} /> : <>{values?.XM}</>
                }
              </Col>
            }
            return ''
          })
        }
      </Row>
      <p className={styles.more}>
        <Link
          to={{
            pathname: '/information/signInDetails',
            state: NoSignInTeacher
          }}>
          查看更多
        </Link></p>
    </div>
  </div>
}
export default SignIn;
