/* eslint-disable no-plusplus */
import { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { Link, useModel } from 'umi';
import moment from 'moment';
import ShowName from '@/components/ShowName';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';
import { getAllByDate } from '@/services/after-class/khjscq';
import { queryXNXQList } from '@/services/local-services/xnxq';
import TeacherQD from '@/assets/TeacherQD.png';

import styles from '../index.less';

const SignIn = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [AllJs, setAllJs] = useState<any>();
  const [NoSignInTeacher, setNoSignInTeacher] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId);
      const res = await getKCBSKSJ({
        XNXQId: result.current?.id,
        startDate: moment(new Date()).format('YYYY-MM-DD'),
      });
      if (res.status === 'ok') {
        const newArrs: any = [];
        const AllTeacher: any = [];

        const JCIdArr: any = [];
        const BJIdArr: any = [];
        const newArr = res.data?.rows?.filter(
          (item: any) =>
            new Date(`${moment(item.SKRQ).format('YYYY/MM/DD')} ${item.XXSJPZ.KSSJ}`) < new Date(),
        );
        res.data?.rows?.forEach((value: any) => {
          value.KCBSKJSSJs.forEach((items: any) => {
            const newData = {
              ...items?.JZGJBSJ,
            };
            AllTeacher.push(newData);
          });
        });
        setAllJs(AllTeacher);
        newArr?.forEach((value: any) => {
          JCIdArr.push(value.XXSJPZId);
          BJIdArr.push(value.KHBJSJId);
          value.KCBSKJSSJs.forEach((items: any) => {
            const newData = {
              ...items?.JZGJBSJ,
              KHBJSJId: value.KHBJSJId,
              KHBJSJ: value.KHBJSJ,
              XXSJPZ: value.XXSJPZ,
            };
            newArrs.push(newData);
          });
        });

        const resgetAllByDate = await getAllByDate({
          XXSJPZIds: JCIdArr,
          KHBJSJIds: BJIdArr,
          CQZT: ['??????', '??????'],
          CQRQ: moment(new Date()).format('YYYY-MM-DD'),
        });
        if (resgetAllByDate.status === 'ok') {
          // ???????????????????????????
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
    })();
  }, []);
  return (
    <div className={styles.SignIn}>
      <p className={styles.title}>??????????????????</p>
      <div
        className={styles.wrap}
        style={{ backgroundImage: `url(${TeacherQD})`, backgroundSize: 'cover' }}
      >
        <p>
          <span className={styles.titles}>???????????????</span>
          <span>
            <span>{AllJs?.length || '0'}</span>???
          </span>
        </p>
        <p>
          <span className={styles.titles}>??????????????????</span>
          <span>
            <span>{NoSignInTeacher?.length || '0'}</span>???
          </span>
        </p>
        <div className={styles.AllTeacher}>
          <Row gutter={[8, 0]}>
            {NoSignInTeacher?.map((values: any, index: number) => {
              if (index < 12) {
                return (
                  <Col span={6}>
                    <ShowName
                      type="userName"
                      openid={values?.WechatUserId}
                      XM={values?.XM}
                      style={{ color: '#666' }}
                    />
                  </Col>
                );
              }
              return '';
            })}
          </Row>
          <p className={styles.more}>
            <Link
              to={{
                pathname: '/information/signInDetails',
                state: NoSignInTeacher,
              }}
            >
              ????????????
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
