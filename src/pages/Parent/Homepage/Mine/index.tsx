import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { Link, useModel, history } from 'umi';
import DisplayColumn from '@/components/DisplayColumn';
import Statistical from './components/Statistical';
import IconFont from '@/components/CustomIcon';
import { enHenceMsg, removeOAuthToken, removeUserInfoCache } from '@/utils/utils';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import { ParentHomeData } from '@/services/local-services/mobileHome';

import imgPop from '@/assets/mobileBg.png';
import evaluation from '@/assets/evaluation.png';
import drop from '@/assets/drop.png';
import icon_Rgo from '@/assets/icon_Rgo.png';

import { iconTextData } from './mock';
import styles from './index.less';

const { Option } = Select;
const Mine = (props: { status: string; setActiveKey: React.Dispatch<React.SetStateAction<string>> }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student, external_contact } = currentUser || {};
  const { status } = props;
  const [totail, setTotail] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [ParentalIdentity, setParentalIdentity] = useState<string>('家长');
  const StorageXSId = localStorage.getItem('studentId') || testStudentId;
  const StorageXSName = localStorage.getItem('studentName');

  useEffect(() => {
    // 存入孩子姓名和id
    if (localStorage.getItem('studentName') === null && localStorage.getItem('studentId') === null) {
      localStorage.setItem('studentName', student?.[0].name || '');
      localStorage.setItem('studentId', student?.[0].XSJBSJId || '');
      localStorage.setItem('studentNjId', student[0].NJSJId || '');
      localStorage.setItem('studentNjId', student[0].BJSJId || '');
    }
    const identity = external_contact?.subscriber_info?.remark?.split('/')?.[0].split('-')[1]
    const ParentalIdentitys = `${StorageXSName}${identity || ''}`;
    setParentalIdentity(ParentalIdentitys);
  }, []);

  // 切换孩子
  const handleChange = async (value: any, key: any) => {
    localStorage.setItem('studentName', key.value);
    localStorage.setItem('studentId', key.key?.split('+')[0]);
    localStorage.setItem('studentNjId', key.key?.split('+')[1]);
    localStorage.setItem('studentBJId', key.key?.split('+')[2]);
    const identity = external_contact?.subscriber_info?.remark?.split('/')?.[0].split('-')[1]
    const ParentalIdentitys = `${key.value}${identity || ''}`;
    setParentalIdentity(ParentalIdentitys);
    setReload(true);
  };
  const fetchData = async () => {
    const studentId: string =
      StorageXSId || student?.[0].XSJBSJId || testStudentId;
    const res = await getAllKHXSDD({
      XSJBSJId: studentId,
      // njId: currentUser.njId,
      DDZT: ['待付款'],
    });
    if (res.status === 'ok') {
      if (res.data && res.data.length) {
        setTotail(true);
      }
    } else {
      enHenceMsg(res.message);
    }
  }
  useEffect(() => {
    fetchData();
  }, [StorageXSId]);

  useEffect(() => {
    (async () => {
      if (reload) {
        // 数据信息重新更新获取
        const studentId: string =
          StorageXSId || student?.[0].XSJBSJId || testStudentId;
        const studentNjId = localStorage.getItem('studentNjId') || (student && student[0].NJSJId);
        await ParentHomeData('student', currentUser?.xxId, studentId, studentNjId, true);
        fetchData();
        setReload(false);
      }
    })()
  }, [reload])
  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.header}>
          {currentUser?.avatar ? <img src={currentUser?.avatar} /> : ''}
          <div className={styles.headerName}>
            <h4>
              {ParentalIdentity || '家长'}
            </h4>
            <span>微信名：{currentUser?.username || currentUser?.name}</span>
          </div>
        </div>
        {student?.length > 1 ? (
          <Select
            style={{ minWidth: '5em' }}
            defaultValue={StorageXSName || student?.[0].studentName}
            className={styles.XsName}
            onChange={handleChange}
          >
            {student?.map((value: any) => {
              return (
                <Option value={value.name} key={`${value.XSJBSJId}+${value.NJSJId}+${value.BJSJId}`}>
                  {value.name}
                </Option>
              );
            })}
          </Select>
        ) : (
          <></>
        )}
      </header>
      <div className={styles.payList}>
        <DisplayColumn
          type="icon"
          title="我的订单"
          isheader={true}
          grid={{ column: 4 }}
          dataSource={iconTextData}
          totil={totail}
        />
      </div>
      <div className={styles.operation}>
        <Link to="/parent/mine/dropClass" className={styles.drop}>
          <img src={drop} alt="" />
          <span className={styles.dropSpan}>我要退订</span>
          <img src={icon_Rgo} alt="" className={styles.icon_Rgo} />
        </Link>
        <Link to="/parent/mine/evaluation" className={styles.evaluation}>
          <img src={evaluation} alt="" />
          <span className={styles.evaluationSpan}>课程评价</span>
          <img src={icon_Rgo} alt="" className={styles.icon_Rgo} />
        </Link>
      </div>

      {status === 'empty' ? '' : <Statistical userId={StorageXSId} xxId={currentUser?.xxId} />}
      <div className={styles.linkWrapper}>
        <ul>
          <li>
            <IconFont type="icon-fuwugonggao" style={{ fontSize: '18px' }} />
            <Link to="/parent/home/notice/announcement?articlepage=serveAnnounce">
              服务公告
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
          <li>
            <IconFont type="icon-guanyu" style={{ fontSize: '18px' }} />
            <Link to="/parent/home/notice/announcement?articlepage=about">
              关于
              <IconFont type="icon-gengduo" />
            </Link>
          </li>
        </ul>
        <div className={styles.signOut}>
          <a
            onClick={() => {
              setInitialState({ ...initialState!, currentUser: undefined });
              removeOAuthToken();
              removeUserInfoCache();
              history.replace(
                initialState?.buildOptions.authType === 'wechat' ? '/auth_callback/overDue' : '/',
              );
            }}
          >
            退出登录
          </a>
        </div>
      </div>
    </div>
  );
};

export default Mine;
