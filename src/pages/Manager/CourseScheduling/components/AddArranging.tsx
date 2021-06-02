/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type {FC} from 'react';
import ProForm, {
    ProFormSelect,
} from '@ant-design/pro-form';
import '../index.less'
import { BJList } from '../mock'
import ProCard from '@ant-design/pro-card';
import type { BJType,RoomType,GradeType } from '../data';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { getAllFJLX } from '@/services/after-class/fjlx';
import {getAllNJSJ} from '@/services/after-class/njsj'
import {getKCSJ} from '@/services/after-class/kcsj'

type PropsType = {
    setState?: any;
};

const AddArranging: FC<PropsType> = (props) => {
    const { setState } = props;
    const [packUp, setPackUp] = useState(false);
    const [Bj, setBj] = useState<any>();
    const [index, setIndex] = useState();
    const [roomType, setRoomType] = useState<any>([]);
    const [gradeType, setGradeType] = useState<any>([]);

    // 班级展开收起
    const unFold = () => {
        if (packUp === false) {
            setPackUp(true)
        } else {
            setPackUp(false)
        }
    }
    // 班级选择
    const BjClick = (value: BJType, key: any) => {
        setBj(value.BJ)
        setIndex(key);
    }
    const submit = async (params: any) => {
        const data = {
            ...params,
            BJ: Bj
        }
        console.log(data);
        setState(true)
        return true;
    }
    const onReset = (prop: any) => {
        prop.form?.resetFields()
        setState(true)
    }

    useEffect(() => {
        async function fetchData() {
          try {
            // 获取所有年纪数据
            const result = await getAllNJSJ();
              if (result.status === 'ok') {
                if (result.data && result.data.length > 0) {
                  const data: any = [].map.call(result.data, (item: GradeType) => {
                    return {
                      label: item.NJMC,
                      value: item.id,
                    };
                  });
                  setGradeType(data);
                }
              } else {
                message.info(result.message);
              }
            // 获取所有课程数据
            const kcsjresult = await getKCSJ({id:'4287dc88-f255-41d9-8420-a9ec2744aa23'});
            console.log(kcsjresult)
              if (kcsjresult.status === 'ok') {
                  console.log(kcsjresult)
                // if (kcsjresult.data && kcsjresult.data.length > 0) {
                //   const data: any = [].map.call(kcsjresult.data, (item: GradeType) => {
                //     return {
                //       label: item.NJMC,
                //       value: item.id,
                //     };
                //   });
                //   setGradeType(data);
                // }
              } else {
                message.info(kcsjresult.message);
              }
            // 获取所有场地类型
            const response = await getAllFJLX({
                name:''
            });
            if (response.status === 'ok') {
              if (response.data && response.data.length > 0) {
                const data: any = [].map.call(response.data, (item: RoomType) => {
                  return {
                    label: item.FJLX,
                    value: item.id,
                  };
                });
                setRoomType(data);
              }
            } else {
              message.info(response.message);
            }
          } catch (error) {
            message.info('error');
          }
        }
        fetchData();
      }, []);
    return (
        <div style={{ background: '#FFFFFF' }}>
            <p className='xinzen'>新增排课</p>
            <ProForm
                className='ArrangingFrom'
                name="validate_other"
                initialValues={{}}
                layout='horizontal'
                onFinish={submit}
                submitter={{
                    render: (Props) => {
                        return [
                            <Button key="rest" onClick={() => onReset(Props)}>
                                取消
                        </Button>,
                            <Button key="submit" onClick={() => Props.form?.submit?.()}>
                                保存
                        </Button>,
                        ];
                    },
                }}
            >
                <ProFormSelect
                    width="md"
                    name="NJ"
                    label="年级"
                    options={gradeType}
                />
                <ProFormSelect
                    width="md"
                    request={async () => [
                        { label: '语文', value: '语文' },
                        { label: '数学', value: '数学' },
                        { label: '英语', value: '英语' },
                    ]}
                    name="KC"
                    label="课程"
                    showSearch
                />
                <div className='banji'>
                    <span>班级：</span>
                    {
                        BJList.length < 15 ?
                            <ProCard ghost className='banjiCard'>
                                {
                                    BJList.map((value, key) => {
                                        return (<ProCard layout="center" bordered
                                            onClick={() => BjClick(value, key)}
                                            style={{ borderColor: index === key ? '#51d081' : '' }}
                                        >
                                            <p>{value.BJ}</p>
                                            <span>{value.LS}</span>
                                        </ProCard>)
                                    })
                                }
                            </ProCard>
                            :
                            <div>
                                {packUp === false ?
                                    <ProCard ghost className='banjiCard' >
                                        {
                                            BJList.slice(0, 13).map((value, key) => {
                                                return (<ProCard layout="center" bordered
                                                    onClick={() => BjClick(value, key)}
                                                    style={{ borderColor: index === key ? '#51d081' : '' }}
                                                >
                                                    <p>{value.BJ}</p>
                                                    <span>{value.LS}</span>
                                                </ProCard>)
                                            })
                                        }
                                        <ProCard layout="center" bordered onClick={unFold} className='unFold'>
                                            展开 <DownOutlined style={{ color: '#4884FF' }} />
                                        </ProCard>
                                    </ProCard> :
                                    <ProCard ghost className='banjiCard'>
                                        {
                                            BJList.map((value, key) => {
                                                return (<ProCard layout="center" bordered
                                                    onClick={() => BjClick(value, key)}
                                                    style={{ borderColor: index === key ? '#51d081' : '' }}>
                                                    <p>{value.BJ}</p>
                                                    <span>{value.LS}</span>
                                                </ProCard>)
                                            })
                                        }
                                        <ProCard layout="center" bordered onClick={unFold} className='unFold'>
                                            收起 <UpOutlined style={{ color: '#4884FF' }} />
                                        </ProCard>
                                    </ProCard>}
                            </div>
                    }
                </div>
                <ProFormSelect
                    width="md"
                    options={roomType}
                    name="CDLX"
                    label="场地类型"
                />
                <ProFormSelect
                    width="md"
                    request={async () => [
                        { label: 'A301画室', value: 'A301画室' },
                        { label: 'A302画室', value: 'A302画室' },
                        { label: 'A303画室', value: 'A303画室' },
                    ]}
                    name="CDMC"
                    label="场地名称"
                    showSearch
                />
            </ProForm>

        </div>)

};

export default AddArranging;