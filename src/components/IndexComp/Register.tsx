/* eslint-disable func-names */
/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-01 08:49:11
 * @LastEditTime: 2021-09-09 13:36:20
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Link, useModel } from 'umi';
import img from '@/assets/Company.png';
import styles from './index.less';
import { getXXJBSJ } from '@/services/after-class/xxjbsj';

const Register = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [schoolInfo, setSchoolInfo] = useState<any>();
  useEffect(() => {
    async function fetchData() {
      const res = await getXXJBSJ({
        id: currentUser?.xxId
      });
      if (res.status === 'ok' && res.data) {
        setSchoolInfo(res.data);
      };
    };
    fetchData();
  }, [])
console.log(schoolInfo);

  return (
    <div className={styles.Index}>
      <img src={img} alt="" />
      <p className={styles.hello}>您好，欢迎使用课后服务平台</p>
      <p className={styles.apply}>请先完善本校相关基本信息</p>
      <Link
        to={{
          pathname: '/basicalSettings/schoolInfo/schoolEditor',
          state: { schoolInfo },
        }}
      >
        <Button type="primary">
          完善基本信息
        </Button>
      </Link>
    </div>
  );
};
export default Register;
