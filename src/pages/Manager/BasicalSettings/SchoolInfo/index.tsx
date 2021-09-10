import { Link,  useModel } from 'umi';
import PageContainer from '@/components/PageContainer';
import CustomForm from '@/components/CustomForm';
import styles from './index.less';
import xxImg from '@/assets/vector.png';
import { basicForm } from './FormItems';
import { useEffect, useState } from 'react';
import { XXJBSJ } from './data';
import { getXXJBSJ } from '@/services/after-class/xxjbsj';

const formItemLayout = {
  labelCol: { flex: '7em' },
  wrapperCol: { flex: 'auto' },
};

const SchoolInfo = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [schoolInfo, setSchoolInfo] = useState<XXJBSJ>();
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
  return (
    <PageContainer>
      <div className={styles.schoolInfoBody}>
        {/* 学校基本信息标题 */}
        <div className={styles.schoolInfoTitle}>
          <div className={styles.schoolInfoLogo}>
            <img src={schoolInfo?.XH || xxImg} alt='logo' />
          </div>
          <div className={styles.schoolInfoTitleHeader} >
            <p>{schoolInfo?.XXMC}</p>
          </div>
          <div className={styles.schoolInfoTitleButton} >
            <Link to={{
              pathname: '/basicalSettings/schoolInfo/schoolEditor',
              state: { schoolInfo },
            }} >编辑</Link>
          </div>
        </div>
        {/* 基本信息 */}
        <div className={styles.schoolInfoBasic}>
          <CustomForm
            values={schoolInfo}
            formItems={basicForm}
            formLayout={formItemLayout}
            hideBtn={true}
            formDisabled={true}
          />
        </div>
      </div>
    </PageContainer >
  );
};

export default SchoolInfo;
