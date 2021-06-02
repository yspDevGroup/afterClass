/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import ProForm, {
    ProFormSelect,
} from '@ant-design/pro-form';
import '../index.less'
import { newClassData } from '../mock'
import ProCard from '@ant-design/pro-card';
import type { BJType, RoomType, GradeType, SiteType,CourseType } from '../data';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { getAllFJLX } from '@/services/after-class/fjlx';
import { getAllNJSJ } from '@/services/after-class/njsj'
import { getAllKHKCSJ } from '@/services/after-class/khkcsj'
import { getAllKHBJSJ } from '@/services/after-class/khbjsj'
import { getAllXNXQ } from '@/services/after-class/xnxq'
import { getAllFJSJ } from '@/services/after-class/fjsj'
import ExcelTable from '@/components/ExcelTable';

type PropsType = {
    setState?: any;
    xn?: any;
    xq?: any;
};

const AddArranging: FC<PropsType> = (props) => {
    const { setState,xn,xq } = props;
    const [packUp, setPackUp] = useState(false);
    const [Bj, setBj] = useState<any>();
    const [index, setIndex] = useState();
    // const [xn, setXn] = useState<any>();
    // const [xq, setXq] = useState<any>();
    const [njId, setNjId] = useState();
    const [kcId, setKcId] = useState();
    const [cdlxId, setCdlxId] = useState();
    // const [cdmcId, setCdmcId] = useState();
    const [cdmcData, setCdmcData] = useState<any>([]);
    const [xnxqId, setxnxqId] = useState<any>([]);
    const [roomType, setRoomType] = useState<any>([]);
    const [gradeType, setGradeType] = useState<any>([]);
    const [siteType, setSiteType] = useState<any>([]);
    const [kcType, setKcType] = useState<any>([]);
    const [bjData, setBjData] = useState<any>([]);
    const columns = [
        {
            title: '',
            dataIndex: 'room',
            key: 'room',
            align: 'center',
            width: 66,
        },
        {
            title: '',
            dataIndex: 'course',
            key: 'course',
            width: 136,
        },
        {
            title: '周一',
            dataIndex: 'monday',
            key: 'monday',
            align: 'center',
            width: 136,
        },
        {
            title: '周二',
            dataIndex: 'tuesday',
            key: 'tuesday',
            align: 'center',
            width: 136,
        },
        {
            title: '周三',
            dataIndex: 'wednesday',
            key: 'wednesday',
            align: 'center',
            width: 136,
        },
        {
            title: '周四',
            dataIndex: 'thursday',
            key: 'thursday',
            align: 'center',
            width: 136,
        },
        {
            title: '周五',
            dataIndex: 'friday',
            key: 'friday',
            align: 'center',
            width: 136,
        },
        {
            title: '周六',
            dataIndex: 'saturday',
            key: 'saturday',
            align: 'center',
            width: 136,
        },
        {
            title: '周日',
            dataIndex: 'sunday',
            key: 'sunday',
            align: 'center',
            width: 136,
        },
    ];
    
    const onExcelTableClick = (value: any) => {
        console.log('onExcelTableClickvalue', value);
    };
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
        setBj(value)
        console.log(value)
        setIndex(key);
    }
  
    const submit = async (params: any) => {
        const data = {
            ...params,
            BJ: Bj
        }
        console.log(data);
        // setState(true)
        return true;
    }
    const onReset = (prop: any) => {
        prop.form?.resetFields()
        setState(true)
    }
    useEffect(() => {
        async function fetchData() {
            try {
                // 获取所有年级数据
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
                    message.error(result.message);
                }
               
               
                     // 获取所有班级数据
                    const bjList = await getAllKHBJSJ({
                        kcId: kcId === undefined ? '' : kcId,
                        njId: njId === undefined ? '' : njId,
                        xn:xn,
                        xq:xq,
                        page: 0,
                        pageCount: 0,
                        name: ''
                    });
                    setBjData(bjList.data)
                    console.log(bjList)
                      // 获取所有课程数据
                    const kcList = await getAllKHKCSJ({
                        xn:xn,
                        xq:xq,
                        page:0,
                        pageCount:0,
                        name:''
                    });
                    if (kcList.status === 'ok') {
                        if (kcList.data && kcList.data.length > 0) {
                            const data: any = [].map.call(kcList.data, (item: CourseType) => {
                                return {
                                    label: item.KCMC,
                                    value: item.id,
                                };
                            });
                            setKcType(data);
                        }
                    } else {
                        message.error(kcList.message);
                    }
              
              
                // 获取所有场地类型
                const response = await getAllFJLX({
                    name: ''
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
                    message.error(response.message);
                }
                // 获取所有场地数据
                const fjList = await getAllFJSJ({
                    lxId: cdlxId === undefined ? '' : cdlxId,
                    page: 0,
                    pageCount: 0,
                    name: '',
                });
                if (fjList.status === 'ok') {
                    if (fjList.data && fjList.data.length > 0) {
                        const data: any = [].map.call(fjList.data, (item: SiteType) => {
                            return {
                                label: item.FJMC,
                                value: item.id,
                            };
                        });
                        setSiteType(data);
                    }
                } else {
                    message.error(fjList.message);
                }

            } catch (error) {
                message.error('error');
            }
        }
        fetchData();
    }, []);
    const chosenData = {
        cla: Bj ? Bj.BJMC:'',
        teacher:Bj ? Bj.ZJS:'',
        xnxqId:Bj ? Bj.KHKCSJ.XNXQId:'',
    };
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
                    fieldProps={{
                        async onChange(value) {
                            setNjId(value);
                            const bjList = await getAllKHBJSJ({
                                kcId: kcId === undefined ? '' : kcId,
                                njId: value,
                                xn:xn,
                                xq:xq,
                                page: 0,
                                pageCount: 0,
                                name: ''
                            });
                            setBjData(bjList.data)
                        }
                    }}
                />
                <ProFormSelect
                    width="md"
                    options={kcType}
                    name="KC"
                    label="课程"
                    showSearch
                    fieldProps={{
                        async onChange(value) {
                            setKcId(value);
                            const bjList = await getAllKHBJSJ({
                                kcId: value,
                                njId: njId === undefined ? '' : njId,
                                xn:xn,
                                xq:xq,
                                page: 0,
                                pageCount: 0,
                                name: ''
                            });
                            setBjData(bjList.data)
                        }
                    }}
                />
                <div className='banji'>
                    <span>班级：</span>
                    {
                        bjData&&bjData.length < 15 ?
                            <ProCard ghost className='banjiCard'>
                                {
                                    bjData.map((value: { BJMC: any; ZJS: any; id?: string | undefined; }, key: undefined) => {
                                        return (<ProCard layout="center" bordered
                                            onClick={() => BjClick(value, key)}
                                            style={{ borderColor: index === key ? '#51d081' : '' }}
                                        >
                                            <p>{value.BJMC}</p>
                                            <span>{value.ZJS}</span>
                                        </ProCard>)
                                    })
                                }
                            </ProCard>
                            :
                            <div>
                                {packUp === false ?
                                    <ProCard ghost className='banjiCard' >
                                        {
                                            bjData.slice(0, 13).map((value: { BJMC: any; ZJS: any; id?: string | undefined; }, key: undefined) => {
                                                return (<ProCard layout="center" bordered
                                                    onClick={() => BjClick(value, key)}
                                                    style={{ borderColor: index === key ? '#51d081' : '' }}
                                                >
                                                    <p>{value.BJMC}</p>
                                                    <span>{value.ZJS}</span>
                                                </ProCard>)
                                            })
                                        }
                                        <ProCard layout="center" bordered onClick={unFold} className='unFold'>
                                            展开 <DownOutlined style={{ color: '#4884FF' }} />
                                        </ProCard>
                                    </ProCard> :
                                    <ProCard ghost className='banjiCard'>
                                        {
                                            bjData.map((value: { BJMC: any; ZJS: any; id?: string | undefined; }, key: undefined) => {
                                                return (<ProCard layout="center" bordered
                                                    onClick={() => BjClick(value, key)}
                                                    style={{ borderColor: index === key ? '#51d081' : '' }}>
                                                    <p>{value.BJMC}</p>
                                                    <span>{value.ZJS}</span>
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
                    fieldProps={{
                        async onChange(value) {
                            setCdlxId(value);
                            const fjList = await getAllFJSJ({
                                lxId: value,
                                page: 0,
                                pageCount: 0,
                                name: '',
                            });
                            console.log(fjList)
                            if (fjList.status === 'ok') {
                                const data: any = [].map.call(fjList.data, (item: SiteType) => {
                                    return {
                                        label: item.FJMC,
                                        value: item.id,
                                    };
                                });
                                setSiteType(data);
                            } else {
                                message.error(fjList.message);
                            }
                        }
                    }}
                />
                <ProFormSelect
                    width="md"
                    options={siteType}
                    name="CDMC"
                    label="场地名称"
                    showSearch
                    fieldProps={{
                        async onChange(value,index) {
                            if(index != undefined){
                                setCdmcData(index);
                                console.log(value,index.children)
                            }
                        }
                    }}
                />
                <div className='site'>
                    <span>场地：</span>
                    <ExcelTable
                        columns={columns}
                        dataSource={newClassData}
                        chosenData={chosenData}
                        onExcelTableClick={onExcelTableClick}
                        switchPages=''
                        type='edit'
                    />
                </div>
            </ProForm>

        </div>)

};

export default AddArranging;