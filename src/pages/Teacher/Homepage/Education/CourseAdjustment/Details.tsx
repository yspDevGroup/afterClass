import GoBack from '@/components/GoBack';
import { Button, Divider, Input, message, Switch } from 'antd';
import styles from './index.less';
import { history, useModel } from 'umi';
import { useEffect, useState } from 'react';
import { getKHJSTDK, updateKHJSTDK } from '@/services/after-class/khjstdk';
import ShowName from '@/components/ShowName';
import moment from 'moment';

const { TextArea } = Input;
const Details = (props: any) => {
  const { state } = props.location;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [Opinion, setOpinion] = useState(true);
  const [Reason, setReason] = useState();
  const [Datas, setDatas] = useState<any>();
  useEffect(() => {
    (async () => {
      const res = await getKHJSTDK({
        id: state?.id,
      });
      if (res.status === 'ok') {
        setDatas(res.data);
        if (res.data.ZT === 5) {
          setOpinion(false);
        } else if (res.data.ZT === 0) {
          setOpinion(true);
        }
      } else {
        message.error(res.message);
      }
    })();
  }, []);

  const onChange = (checked: any) => {
    setOpinion(checked);
  };
  const onChanges = (e: any) => {
    setReason(e.target.value);
  };
  const onSubmit = async () => {
    const res = await updateKHJSTDK(
      { id: state?.id },
      {
        ZT: Opinion === true ? 4 : 5,
        XXJBSJId: currentUser.xxId,
        DKBZ: Reason,
        DKSPSJ: moment(new Date()).format(),
      },
    );
    if (res.status === 'ok') {
      message.success('提交成功');
      history.push('/teacher/home/substituteList');
    }
  };
  return (
    <div className={styles.Details}>
      <GoBack title={'详情'} teacher />
      {Datas ? (
        <div className={styles.wraps}>
          <div className={styles.apply}>
            <p className={styles.title}>
              <ShowName type="userName" openid={Datas?.SKJS?.WechatUserId} XM={Datas.SKJS?.XM} />
              教师的{Datas?.LX === 0 ? '调课' : '代课'}申请
            </p>
            <p>
              课程：{Datas.KHBJSJ?.KHKCSJ?.KCMC} — {Datas.KHBJSJ?.BJMC}
            </p>
            <p>
              {`${Datas?.LX === 0 ? '原上课' : ''}时间：${moment(Datas?.SKRQ).format(
                'MM月DD日',
              )}，${Datas.SKJC?.TITLE}【${Datas.SKJC?.KSSJ.substring(0, 5)}-
              ${Datas.SKJC?.JSSJ.substring(0, 5)}】`}
            </p>
            <p>
              {Datas?.LX === 0 ? '原上课' : ''}地点：{Datas?.SKFJ?.FJMC}{' '}
            </p>
            {Datas?.LX === 0 ? (
              <>
                <Divider />
                <p>
                  调课后时间：{moment(Datas?.TKRQ).format('MM月DD日')}，{Datas.TKJC?.TITLE}【
                  {Datas.TKJC?.KSSJ.substring(0, 5)}-{Datas.TKJC?.JSSJ.substring(0, 5)}】
                </p>
                <p>
                  {Datas?.LX === 0 ? '调课后' : ''}地点：{Datas?.TKFJ?.FJMC}{' '}
                </p>
              </>
            ) : (
              ''
            )}
            <p>
              {Datas?.LX === 0 ? '调课' : '代课'}原因：{Datas.BZ}
            </p>
          </div>
          <div className={styles.process}>
            <p className={styles.title}>流程</p>
            <div className={styles.processLine}>
              <div className={styles.circular} />
              <div className={styles.Line} />
              <div className={styles.circular} />
              {Datas?.LX === 0 ? (
                <></>
              ) : (
                <>
                  {' '}
                  <div className={styles.Line} />
                  <div className={styles.circular} />
                </>
              )}
            </div>
            <div className={styles.role}>
              <div>
                <p>发起人</p>
                <p>申请{Datas?.LX === 0 ? '调课' : '代课'}的老师</p>
              </div>
              <div>
                {' '}
                <ShowName type="userName" openid={Datas?.SKJS?.WechatUserId} XM={Datas.SKJS?.XM} />
              </div>
            </div>
            {Datas?.LX === 0 ? (
              <></>
            ) : (
              <div className={styles.role}>
                <div>
                  <p>代课人</p>
                  <p>代替授课的老师</p>
                </div>
                <div>
                  {' '}
                  <ShowName
                    type="userName"
                    openid={Datas?.DKJS?.WechatUserId}
                    XM={Datas.DKJS?.XM}
                  />
                </div>
              </div>
            )}

            <div className={styles.roles}>
              <div>
                <p>审批人</p>
                <p>学校管理员 </p>
              </div>
              {Datas?.SPJS ? (
                <div>
                  <ShowName
                    type="userName"
                    openid={Datas?.SPJS?.WechatUserId}
                    XM={Datas.SPJS?.XM}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
            {(Datas?.ZT === 0 && state.type === 'view') || Datas.ZT === 3 ? (
              <></>
            ) : (
              <p className={styles.switch}>
                <span>是否同意代课</span>
                <Switch
                  defaultChecked={Datas?.ZT === 4 || Datas?.ZT === 1 || Datas?.ZT === 0}
                  onChange={onChange}
                  disabled={state.type === 'view' || Datas.ZT === 4}
                />
              </p>
            )}
            {Datas?.DKBZ ? <p style={{ fontSize: '16px' }}>说明：{Datas?.DKBZ}</p> : <></>}
            {Datas?.ZT === 5 ? (
              <></>
            ) : (
              <>
                {' '}
                {Opinion === true || (state.type === 'view' && Datas?.ZT === 0) ? (
                  <></>
                ) : (
                  <TextArea
                    placeholder="请说明原因"
                    showCount
                    maxLength={100}
                    onChange={onChanges}
                  />
                )}
              </>
            )}
          </div>

          {state.type === 'edit' && Datas.ZT === 0 ? (
            <div className={styles.fixedBtn}>
              <Button
                onClick={() => {
                  history.push('/teacher/home/substituteList');
                }}
              >
                取消
              </Button>
              <Button onClick={onSubmit}>提交</Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Details;
