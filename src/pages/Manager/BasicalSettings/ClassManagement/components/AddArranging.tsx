import type { FC} from 'react';
import React, { useEffect, useState } from 'react';
import ProForm, {
ProFormSelect,
} from '@ant-design/pro-form';
import '../index.less'
import { BJList } from '../mock'
import ProCard from '@ant-design/pro-card';
import type { BJType } from '../data';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import { Button } from 'antd';

type PropsType = {
    setState?: any;
};

const AddArranging: FC<PropsType> = (props) => {
    const { setState } = props;
    const [packUp, setPackUp] = useState(false);
    const [Bj, setBj] = useState<any>();
    const [index, setIndex] = useState();
    const unFold = () => {
        if (packUp === false) {
            setPackUp(true)
        } else {
            setPackUp(false)
        }
    }
    const BjClick = (value: BJType, key: any) => {
        console.log(value.BJ)
        setBj(value.BJ)
        setIndex(key);
    }
    const submit = async (params: any) => {
        const data ={
            ...params,
            BJ:Bj
        }
        console.log(data,111)
        setState(true)
        return true;
    }
    const onReset = (props: any)=>{
        props.form?.resetFields()
        setState(true)
    }
    useEffect(() => {
        (async () => {

        })();
    }, []);
    return (
        <div style={{ background: '#FFFFFF' }}>
            <p className='xinzen'>新增排课</p>
            <ProForm
                className='ArrangingFrom'
                name="validate_other"
                initialValues={{}}
                layout='horizontal'
                // onValuesChange={(_, values) => {
                //     console.log(values);
                // }}
                onFinish={submit}
                submitter={{
                    render: (props, doms) => {
                      console.log(props);
                      return [
                        <Button  key="rest" onClick={()=>onReset(props)}>
                          取消
                        </Button>,
                        <Button  key="submit" onClick={() => props.form?.submit?.()}>
                          保存
                        </Button>,
                      ];
                    },
                  }}
            >
                <ProFormSelect
                    width="md"
                    request={async () => [
                        { label: '一年级', value: '一年级' },
                        { label: '二年级', value: '二年级' },
                        { label: '三年级', value: '三年级' },
                    ]}
                    name="NJ"
                    label="年级"
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
                />
                <div className='banji'>
                    <span>班级：</span>
                    {
                        BJList.length < 13 ?
                            <ProCard ghost className='banjiCard'>
                                {
                                    BJList.map((value, key) => {
                                        return (<ProCard layout="center" bordered
                                            onClick={() => BjClick(value, key)}
                                            style={{borderColor: index === key ? '#51d081' : ''}}
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
                                <ProCard ghost className='banjiCard'>
                                    {
                                        BJList.slice(0, 13).map((value, key) => {
                                            return (<ProCard  layout="center" bordered
                                                onClick={() => BjClick(value, key)}
                                                style={{borderColor: index === key ? '#51d081' : ''}}
                                            >
                                                <p>{value.BJ}</p>
                                                <span>{value.LS}</span>
                                            </ProCard>)
                                        })
                                    }
                                    <ProCard layout="center" bordered onClick={unFold} className='unFold'>
                                        展开 <DownOutlined style={{ color: '#4884FF' }}  />
                                    </ProCard>
                                </ProCard> :
                                <ProCard ghost className='banjiCard'>
                                    {
                                        BJList.map((value,key) => {
                                            return (<ProCard layout="center" bordered
                                                onClick={() => BjClick(value,key)}
                                                style={{borderColor: index === key ? '#51d081' : ''}}>
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
                    request={async () => [
                        { label: 'A类', value: 'A类' },
                        { label: 'B类', value: 'B类' },
                        { label: 'C类', value: 'C类' },
                    ]}
                    name="CDLX"
                    label="场地类型"
                /> <ProFormSelect
                    width="md"
                    request={async () => [
                        { label: 'A301画室', value: 'A301画室' },
                        { label: 'A302画室', value: 'A302画室' },
                        { label: 'A303画室', value: 'A303画室' },
                    ]}
                    name="CDMC"
                    label="场地名称"
                />


            </ProForm>

        </div>)

};

export default AddArranging;