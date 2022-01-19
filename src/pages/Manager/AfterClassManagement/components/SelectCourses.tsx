
import { getAllClassesByNJ } from '@/services/after-class/khbjsj';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { Tag, Modal, Button, message } from 'antd';
import React, { useState, useEffect, useRef } from 'react';

import type { DataNode } from './SelectCoursesModal';
import SelectCoursesModal from './SelectCoursesModal';

type selectType = {
  label: string,
  value: string,
}
type SelectCourseProps = {
  onChange?: any, // function
  value?: selectType[],
  title?: string, // 弹框标题
  maxLength?: number,// 可选课程最大长度
  getNJArr?: any, // 获取课程 function
  flag?: number, // 0 课程班 基础 1 辅导课程表
  XNXQId?: string, // 学年学期id
  XQSJId?: string, //校区ID
  BJSJId?: string, //班级id
  disabled?: boolean
}

const SelectCourses = (props: SelectCourseProps) => {
  const refModal = useRef<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const { value, onChange, flag, getNJArr, XNXQId, title,XQSJId,BJSJId,disabled = false } = props;
  const [KHKCLXData, setKHKCLXData] = useState<string[]>();
  const [dataSource, setDataSource] = useState<DataNode[] | undefined>();
  const [selectValue, setSelectValue] = useState<DataNode[] | undefined>();


  const onClose = (id: string) => {
    const list = value?.filter((v: selectType) => v?.value !== id);
    if (onChange) {
      onChange(list);
    }
  }

  // 获取课后课程类别
  const getKHKCLXData = async () => {
    const res = await getAllKHKCLX({ name: '' });
    if (res?.status === 'ok') {
      // const list = res?.data?.filter((item: any) => flag === 0 ? item.KCTAG !== '校内辅导' : item.KCTAG === '校内辅导').map((item: any) => item?.id)

      const list: any = [];
      res.data?.forEach((item: any) => {
        list?.push(item?.id)
      })
      setKHKCLXData(list)
      console.log(list, 'list-----')
    }
  }

  useEffect(() => {
    getKHKCLXData();
  }, [])
  useEffect(() => {
    if (value?.length) {
      const arr: DataNode[] = value?.map((item: selectType) => {
        return {
          title: item?.label,
          type: 'KCB',
          key: item?.value,
          isLeaf: true,
        }
      })
      setSelectValue(arr);
    } else {
      setSelectValue([])
    }
  }, [value])

  /**
   * 获取课程班 tag
   * @returns
   */
  const getTags = () => {
    return value?.map((item: selectType) => <Tag closable={!disabled} onClose={(e) => { e.preventDefault(); onClose(item?.value); }}>{item?.label}</Tag>);
  }

  // 获取课后课程
  const getKHKCData = async (BJMC: string | undefined = undefined) => {
    const NJSJIds = getNJArr();
    if (NJSJIds?.length && XQSJId) {
      const res = await getAllClassesByNJ({
        XNXQId,
        NJSJIds: getNJArr(),
        BMLX: 0,
        KHKCLXIds: KHKCLXData,
        ISQY: 0, // 是否启用,
        ISZB: flag === 0 ? 1 : 0,
        BJZT: '已开班',
        pageSize: 0,
        page: 0,
        BJMC: BJMC,
        XQSJId,
        BJSJId,
      });
      console.log(res, '----------------------------------')
      if (res?.status === 'ok') {
        const { rows } = res.data;
        if (rows.length) {
          const newDataSource: DataNode[] = []
          rows.forEach((item: any) => {
            const KCBData: DataNode = {
              title: item?.BJMC,
              type: 'KCB',
              key: item?.id,
            };
            const KCData: DataNode = {
              title: item?.KHKCSJ?.KCMC,
              type: 'KC',
              key: item?.KHKCSJ?.id,
              children: [KCBData]
            };
            const FLData: DataNode = {
              title: item?.KHKCSJ?.KHKCLX?.KCTAG,
              type: 'FL',
              key: item?.KHKCSJ?.KHKCLX?.id,
              selectable: false,
              children: [KCData]
            };
            // 判断 有没有当前分类
            if (newDataSource.some((FLItem: DataNode) => FLData?.key === FLItem.key)) {
              newDataSource.forEach((FLItem: DataNode) => {
                // 查找对应的分类
                if (FLItem?.key === FLData?.key) {
                  let KCFlag = false;
                  FLItem?.children?.forEach((KCItem: DataNode) => {
                    if (KCItem.key === KCData.key) {
                      KCFlag = true;
                      KCItem.children?.push(KCBData);
                    }
                  })
                  if (!KCFlag) {
                    FLItem.children?.push (KCData)
                  }
                }
              })
            } else {
              newDataSource.push(FLData);
            }
          });
          setDataSource(newDataSource);
        }else{
          setDataSource([]);
        }
      }

    } else {
      message.error('请先选择年级');
    }
  }

  const onModalSubmit=()=>{
   const list= refModal.current?.getSelcetValue?.();
   setVisible(false);
   if(list.length&&onChange){
      onChange(list)
   }
  }

  useEffect(() => {
    if (visible) {
      getKHKCData()
    }
  }, [visible])
  return (
    <>
      <div className={disabled ? 'ant-input ant-form-item-control-input courseSpecialLyn' :'ant-input ant-form-item-control-input'} onClick={() => { 
        if(!disabled){
          setVisible(!visible)
        }
       }}>
        {getTags()}
      </div>
      <Modal
        onCancel={() => { setVisible(false) }}
        title={title}
        visible={visible}
        destroyOnClose
        width={600}
        footer={<>
          <Button onClick={()=>{setVisible(false)}}>取消</Button>
          <Button type="primary" onClick={onModalSubmit}> 确定</Button>
        </>}
      >
        <SelectCoursesModal
          ref={refModal}
          dataSource={dataSource}
          selectValue={selectValue}
          onSearch={getKHKCData}
          onChange={(v: any) => {
            console.log('v', v);
          }} />
      </Modal>
    </>
  )
}

export default SelectCourses
