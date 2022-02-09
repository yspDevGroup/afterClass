/*
 * @description:
 * @author: wsl
 * @Date: 2021-12-28 16:09:07
 * @LastEditTime: 2022-02-09 14:43:36
 * @LastEditors: zpl
 */
import noOrder1 from '@/assets/noOrder1.png';
import { Link } from 'umi';
import ShowName from '@/components/ShowName';
import moment from 'moment';
import styles from './index.less';

const TDKList = (props: { data: any; type: string }) => {
  const { data, type } = props;
  return (
    <div className={styles.TDKList}>
      {data.length === 0 ? (
        <div className={styles.Selected}>
          <div className={styles.noOrder}>
            <div>
              <p>您当前没有任何记录</p>
            </div>
            <img src={noOrder1} alt="" />
          </div>
        </div>
      ) : (
        <div className={styles.wraps}>
          {data.map((item: any) => {
            return (
              <Link
                to={{
                  pathname: '/teacher/education/courseAdjustment/details',
                  state: { id: item.id, type: type },
                }}
              >
                <div className={styles.Information}>
                  <div>
                    <h4>
                      <span>{item.LX === 1 ? '【代】' : '【调】'}</span>
                      <ShowName
                        XM={item?.SKJS?.XM}
                        type="userName"
                        openid={item?.SKJS?.WechatUserId}
                      />
                      教师发起申请
                      {item.ZT === 3 ? (
                        <span className={styles.cards}>已撤销</span>
                      ) : item.ZT === 4 ? (
                        <span
                          className={styles.cards}
                          style={{ color: '#FFB257', borderColor: '#FFB257' }}
                        >
                          审批中
                        </span>
                      ) : item.ZT === 0 ? (
                        <span
                          className={styles.cards}
                          style={{ color: '#fff', backgroundColor: '#FF7527', border: 'none' }}
                        >
                          待处理
                        </span>
                      ) : item.ZT === 1 ? (
                        <span
                          className={styles.cards}
                          style={{ color: '#15B628', borderColor: '#15B628' }}
                        >
                          已通过
                        </span>
                      ) : item.ZT === 2 || item.ZT === 5 ? (
                        <span
                          className={styles.cards}
                          style={{ color: '#FF4B4B', borderColor: '#FF4B4B' }}
                        >
                          已驳回
                        </span>
                      ) : (
                        ''
                      )}
                    </h4>
                    <span>{moment(item.updatedAt || item.createdAt).format('YYYY.MM.DD')}</span>
                  </div>
                  <p>
                    课程：{item.KHBJSJ?.KHKCSJ?.KCMC} — {item.KHBJSJ?.BJMC}
                  </p>
                  <p>
                    {`时间：${moment(item?.SKRQ).format('MM月DD日')}，${
                      item.SKJC?.TITLE
                    }【${item.SKJC?.KSSJ.substring(0, 5)}-
              ${item.SKJC?.JSSJ.substring(0, 5)}】`}
                  </p>
                  <p>
                    {item.LX === 1 ? '代' : '调'}课原因：{item.BZ}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TDKList;
