import GoBack from "@/components/GoBack";
import { Button, Input, message, Switch } from "antd";
import styles from './index.less'
import { history } from 'umi';
import { useEffect, useState } from "react";
import { getKHJSTDK, updateKHJSTDK } from "@/services/after-class/khjstdk";
import WWOpenDataCom from "@/components/WWOpenDataCom";
import moment from "moment";

const { TextArea } = Input;
const Details = (props: any) => {
  const { state } = props.location;
  const [Opinion, setOpinion] = useState(true);
  const [Reason, setReason] = useState();
  const [Datas, setDatas] = useState<any>();
  useEffect(() => {
    (
      async () => {
        const res = await getKHJSTDK({
          id: state?.id
        })
        if (res.status === 'ok') {
          setDatas(res.data)
          if (res.data.ZT === 5) {
            setOpinion(false)
          } else if (res.data.ZT === 0) {
            setOpinion(false)
          }
        } else {
          message.error(res.message)
        }
      }
    )()
  }, [])

  const onChange = (checked: any) => {
    setOpinion(checked);
  }
  const onChanges = (e: any) => {
    setReason(e.target.value);
  };
  const onSubmit = async () => {
    const res = await updateKHJSTDK({ id: state?.id }, {
      ZT: Opinion === true ? 4 : 5,
      DKBZ: Reason,
      DKSPSJ: moment(new Date).format()
    })
    if (res.status === 'ok') {
      message.success('提交成功')
      history.push('/teacher/home/substituteList')

    }
  }
  const showWXName = Datas?.SKJS?.XM === '未知' && Datas?.SKJS?.WechatUserId;
  const DkshowWXName = Datas?.DKJS?.XM === '未知' && Datas?.DKJS?.WechatUserId;
  const SPshowWXName = Datas?.SPJS?.XM === '未知' && Datas?.SPJS?.WechatUserId;
  return <div className={styles.Details}>
    <GoBack title={'详情'} teacher />
    {
      Datas ? <div className={styles.wraps}>
        <div className={styles.apply}>
          <p className={styles.title}>
            {
              showWXName ? <WWOpenDataCom type="userName" openid={Datas?.SKJS?.WechatUserId} /> : Datas.SKJS?.XM
            }教师的代课申请</p>
          <p>时间：{moment(Datas?.SKRQ).format('MM月DD日')}， {Datas.XXSJPZ?.KSSJ.substring(0, 5)}-{Datas.XXSJPZ?.JSSJ.substring(0, 5)}</p>
          <p>地点：{Datas?.SKFJ?.FJMC} </p>
          <p>课程：{Datas.KHBJSJ?.KHKCSJ?.KCMC}</p>
          <p>原因：{Datas.BZ}</p>
        </div>
        <div className={styles.process}>
          <p className={styles.title}>流程</p>
          <div className={styles.processLine}>
            <div className={styles.circular} />
            <div className={styles.Line} />
            <div className={styles.circular} />
            {
              Datas?.LX === 0 ? <></> : <> <div className={styles.Line} />
                <div className={styles.circular} /></>
            }
          </div>
          <div className={styles.role}>
            <div>
              <p>发起人</p>
              <p>申请{Datas?.LX === 0 ? '调课' : '代课'}的老师</p>
            </div>
            <div> {
              showWXName ? <WWOpenDataCom type="userName" openid={Datas?.SKJS?.WechatUserId} /> : Datas.SKJS?.XM
            }</div>
          </div>
          {
            Datas?.LX === 0 ? <></> : <div className={styles.role}>
              <div>
                <p>代课人</p>
                <p>代替授课的老师</p>
              </div>
              <div> {
                DkshowWXName ? <WWOpenDataCom type="userName" openid={Datas?.DKJS?.WechatUserId} /> : Datas.DKJS?.XM
              }</div>
            </div>
          }

          <div className={styles.roles}>
            <div>
              <p>审批人</p>
              <p>学校管理员 </p>
            </div>
            {
              Datas?.SPJS ? <div>{SPshowWXName ? <WWOpenDataCom type="userName" openid={Datas?.SPJS?.WechatUserId} /> : Datas.SPJS?.XM}</div> : <></>
            }

          </div>
          {
            (Datas?.ZT === 0 && state.type === 'view') || Datas.ZT === 3 ? <></> :
              <p className={styles.switch}>
                <span>是否同意调课</span>
                <Switch defaultChecked={Datas?.ZT === 4 || Datas?.ZT === 1} onChange={onChange} disabled={state.type === 'view' || Datas.ZT === 4} />
              </p>
          }

          {
            Datas?.ZT === 5 ? <p >原因：{Datas?.DKBZ}</p> : <> {
              Opinion === true || (state.type === 'view' && Datas?.ZT === 0) ? <></> :
                <TextArea placeholder="请说明原因" showCount maxLength={100} onChange={onChanges} />
            }</>
          }
        </div>

        {
          state.type === 'edit' && Datas.ZT === 0 ? <div className={styles.fixedBtn}>
            <Button onClick={() => {
              history.push('/teacher/home/substituteList')
            }}>取消</Button>
            <Button onClick={onSubmit}>提交</Button>
          </div> : <></>
        }
      </div> : <></>
    }
  </div>
}

export default Details;
