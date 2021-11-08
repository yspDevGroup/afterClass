import GoBack from '@/components/GoBack';
import { Empty, Rate } from 'antd';
import styles from './index.less';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { getAllKHXSPJ } from '@/services/after-class/khxspj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import noOrder from '@/assets/noOrder.png';

const TeacherEvaluation = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Datas, setDatas] = useState<any>([]);
  const StorageXSId = localStorage.getItem('studentId');
  useEffect(() => {
    const { student } = currentUser || {};
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId, undefined);
      const res = await getAllKHXSPJ({
        XSJBSJId: StorageXSId || student?.[0].XSJBSJId || testStudentId,
        KHBJSJId: '',
        JSId: '',
        XNXQId: result.current.id,
        page: 0,
        pageSize: 0,
      });
      setDatas(res.data?.rows);
    })();
  }, [StorageXSId]);
  return (
    <div className={styles.TeacherEvaluation}>
      <GoBack title={'教师寄语'} onclick="/parent/home?index=study" />

      {Datas?.length === 0 ? (
        <div className={styles.noData}>
          <img src={noOrder} alt="" />
          <p>暂无数据</p>
        </div>
      ) : (
        <div className={styles.wrap}>
          {Datas?.map((value: any) => {
            return (
              <div className={styles.cards}>
                <p>
                  {' '}
                  <span>{value?.JZGJBSJ?.XM}老师</span> <Rate disabled value={value?.PJFS} />
                </p>
                <p>
                  <span>
                    {value?.KHBJSJ?.BJMC} ｜{value?.KHBJSJ?.KHKCSJ?.KCMC}
                  </span>{' '}
                  <span>{value?.createdAt?.split(' ')[0]}</span>{' '}
                </p>
                <div className={styles.content}>{value?.PY}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default TeacherEvaluation;
