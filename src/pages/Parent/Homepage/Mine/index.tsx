import React, { useState, useContext, useEffect } from 'react';
import { Link, useModel } from 'umi';
import DisplayColumn from '@/components/DisplayColumn';
import Statistical from './components/Statistical';
import IconFont from '@/components/CustomIcon';
import myContext from '@/utils/MyContext';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import imgPop from '@/assets/mobileBg.png';
import styles from './index.less';
import { iconTextData } from './mock';
import { enHenceMsg } from '@/utils/utils';
import evaluation from '@/assets/evaluation.png';
import drop from '@/assets/drop.png';
import icon_Rgo from '@/assets/icon_Rgo.png';
import { Select } from 'antd';
// import { Col, Row } from 'antd';
// import evaluation from '@/assets/evaluation.png';
// import drop from '@/assets/drop.png';
// import { RightOutlined } from '@ant-design/icons';

const { Option } = Select;
const Mine = (props: { setActiveKey: React.Dispatch<React.SetStateAction<string>> }) => {
  const { setActiveKey } = props;
  const { currentUserInfo, courseStatus } = useContext(myContext);
  const [totail, setTotail] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [ParentalIdentity, setParentalIdentity] = useState<string>('家长');
  const StorageXSId = localStorage.getItem('studentId');
  const StorageXSName = localStorage.getItem('studentName');

  useEffect(() => {
    // 存入孩子姓名和id
    if (localStorage.getItem('studentName') && localStorage.getItem('studentId')) {
      localStorage.getItem('studentName');
      localStorage.getItem('studentId');
    } else {
      localStorage.setItem('studentName', currentUser?.student?.[0].name || '');
      localStorage.setItem('studentId', currentUser?.student?.[0].XSJBSJId || '');
    }
    const ParentalIdentitys = `${StorageXSName}${currentUser?.external_contact?.subscriber_info?.remark?.split('-')[1] || ''
      }`;
    setParentalIdentity(ParentalIdentitys);
  }, []);

  // 切换孩子
  const handleChange = (value: any, key: any) => {
    localStorage.setItem('studentName', key.value);
    localStorage.setItem('studentId', key.key?.split('+')[0]);
    localStorage.setItem('studentNjId', key.key?.split('+')[1]);
    const ParentalIdentitys = `${key.value}${currentUser?.external_contact?.subscriber_info?.remark?.split('-')[1] || ''
      }`;
    setParentalIdentity(ParentalIdentitys);
    // 切换到首页
    setActiveKey('index');
  };
  useEffect(() => {

    async function fetch() {
      const studentId: string =
        StorageXSId || currentUser?.student?.[0].XSJBSJId || testStudentId;
      const res = await getAllKHXSDD({
        XSJBSJId: studentId,
        // njId: currentUser.njId,
        DDZT: '待付款',
      });
      if (res.status === 'ok') {
        if (res.data && res.data.length) {
          setTotail(true);
        }
      } else {
        enHenceMsg(res.message);
      }
    }
    fetch();
  }, [StorageXSId]);

  return (
    <div className={styles.minePage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }} />
        <div className={styles.header}>
          {currentUserInfo?.avatar ? <img src={currentUserInfo?.avatar} /> : ''}
          <div className={styles.headerName}>
            <h4>
              {/* {currentUserInfo?.external_contact?.subscriber_info.remark ||
                currentUserInfo?.username ||
                '家长'} */}
              {ParentalIdentity || '家长'}
            </h4>
            {/* <h4>{currentUser?.student?.name || currentUserInfo?.username || '家长'}</h4> */}
            <span>微信名：{currentUserInfo?.username || currentUserInfo?.name}</span>
          </div>
        </div>
        {currentUser?.student?.length > 1 ? (
          <Select
            style={{ minWidth: '5em' }}
            defaultValue={StorageXSName || currentUser?.student?.[0].studentName}
            className={styles.XsName}
            onChange={handleChange}
          >
            {currentUser?.student?.map((value: any) => {
              return (
                <Option value={value.name} key={`${value.XSJBSJId}+${value.NJSJId}`}>
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
          <span className={styles.dropSpan}>退课退款</span>
          <img src={icon_Rgo} alt="" className={styles.icon_Rgo} />
        </Link>
        <Link to="/parent/mine/evaluation" className={styles.evaluation}>
          <img src={evaluation} alt="" />
          <span className={styles.evaluationSpan}>课程评价</span>
          <img src={icon_Rgo} alt="" className={styles.icon_Rgo} />
        </Link>
      </div>

      {courseStatus === 'empty' ? '' : <Statistical />}
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
      </div>
    </div>
  );
};

export default Mine;
