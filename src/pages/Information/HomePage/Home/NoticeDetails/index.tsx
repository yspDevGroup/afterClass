import { JYJGTZGG } from '@/services/after-class/jyjgtzgg';
import { useEffect, useState } from 'react';
import TopNav from './../components/TopNav';
import { XXTZGG } from '@/services/after-class/xxtzgg';
import styles from './index.less';
import Footer from '@/components/Footer';
import { useModel } from 'umi';
import MobileCon from '@/components/MobileCon';

const NoticeDetails = (props: any) => {
  const { initialState } = useModel('@@initialState');
  const { allDataSource, index, infoType } = props.location.state;
  const [nrInfo, setNrInfo] = useState<any>();

  const getData = async () => {
    if (infoType === 'zc') {
      const result = await JYJGTZGG({ id: allDataSource[index].id });
      setNrInfo(result.data.NR);
    } else {
      const result = await XXTZGG({ id: allDataSource[index].id });
      setNrInfo(result.data.NR);
    }
  };

  useEffect(() => {
    getData();
  }, [allDataSource[index].id]);

  return (
    <MobileCon>
      <div className={styles.DetailsBox}>
        <TopNav title="通告详情" state={true} />
        {allDataSource[index]?.BT ? (
          <div className={styles.title}>{allDataSource[index]?.BT}</div>
        ) : (
          ''
        )}
        {allDataSource[index]?.RQ ? (
          <div className={styles.time}>发布时间：{allDataSource[index]?.RQ}</div>
        ) : (
          ''
        )}
        {allDataSource[index].createdAt || allDataSource[index].createdAt ? (
          <div className={styles.line} />
        ) : (
          ''
        )}
        <>
          <div dangerouslySetInnerHTML={{ __html: nrInfo }} className={styles.contents} />
          <div className={styles.xb}>
            <Footer copyRight={initialState?.buildOptions.ENV_copyRight} />
          </div>
        </>
      </div>
    </MobileCon>
  );
};

export default NoticeDetails;
