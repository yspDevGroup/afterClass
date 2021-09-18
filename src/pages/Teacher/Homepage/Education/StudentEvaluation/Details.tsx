import GoBack from '@/components/GoBack';
import { getEnrolled } from '@/services/after-class/khbjsj';
import { Button, message, Modal, Rate } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import styles from './index.less'
import {createKHXSPJ, getKHXSPJ, updateKHXSPJ} from '@/services/after-class/khxspj'
import { useModel } from 'umi';

const Details = (props: any) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { state } = props.location;
  const [StudentData, setStudentData] = useState<any>();
  const [peopleNum, setPeopleNum] = useState<any>();
  const [Fraction, setFraction] = useState<number>();
  const [Evaluation, setEvaluation] = useState<string>();
  const [XsData, setXsData] = useState<any>()
  const ongetEnrolled = async()=>{
    const res = await getEnrolled({
      id: state?.id
    })
    setStudentData(res.data)
    const newArr: any[] = [];
    res.data?.forEach((value: any) => {
      if (value.KHXSPJId === '') {
        newArr.push(value)
      }
    })
    setPeopleNum(newArr)
  }
  useEffect(() => {
    ongetEnrolled();
  }, []);

  /** 课后帮服务协议弹出框 */
  const showModal = async(value: any) => {
    setIsModalVisible(true);
    setXsData(value)
    if(value.KHXSPJId !== ""){
      const res = await getKHXSPJ({
        id:value.KHXSPJId
      })
      if(res.status === 'ok'){
        setFraction(res.data.PJFS)
        setEvaluation(res.data.PY)
      }
    }
  };
  const handleOk = async () => {
    setIsModalVisible(false);
    if(XsData?.KHXSPJId === ''){
      const res = await createKHXSPJ({
        PJFS: Fraction || 0,
        PY: Evaluation || "",
        XSId: XsData?.XSId,
        XSXM: XsData?.XSXM,
        KHJSSJId: currentUser?.JSId || '1965a118-4b5b-4b58-bf16-d5f45e78b28c',
        KHBJSJId: state?.id
      })
      if(res.status === 'ok'){
        message.success('评价成功')
        ongetEnrolled();
      }
    }else{
      const res = await updateKHXSPJ({id:XsData?.KHXSPJId},{
        PJFS: Fraction,
        PY: Evaluation,
      })
      if(res.status === 'ok'){
        message.success('修改成功')
        ongetEnrolled();
      }
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setEvaluation('')
    setFraction(0)
  };
  const handleChange = (value: any) => {
    setFraction(value)
  };
  const onChange = (e: any) => {
    setEvaluation(e.target.value)
  };
  return <div className={styles.Details}>
    <GoBack title={'学生评价'} />
    <p className={styles.KCMC}>{state?.KHKCSJ?.KCMC}</p>
    <p className={styles.BJMC}>{state?.BJMC}</p>
    <div className={styles.cards}>
      <div>
        <div><p>{StudentData?.length}</p>总人数</div>
        <div><p>{StudentData?.length - peopleNum?.length}</p>已评</div>
        <div><p>{peopleNum?.length}</p>未评</div>
      </div>
    </div>
    <div className={styles.StudentList}>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {
            StudentData?.map((value: any, index: number) => {
              return <tr style={{ backgroundColor: index % 2 === 0 ? "#F5F5F5" : "#fff" }}>
                <td>{value?.XSXM}</td>
                <td>
                  <Button onClick={() => {
                    showModal(value)
                  }}
                  >
                    {value?.KHXSPJId === "" ? "去评价" : "查看"}</Button>
                </td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
    <Modal
      title={XsData?.KHXSPJId === '' ? "编辑评价":"修改评价"}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      closable={false}
      className={styles.showagreement}
    >
      <div className={styles.content}>
        <p>综合评价：<Rate onChange={handleChange} value={Fraction} /></p>
        <TextArea placeholder="请输入您的评价" showCount maxLength={200} onChange={onChange} value={Evaluation} />
      </div>

    </Modal>
  </div>
}

export default Details;
