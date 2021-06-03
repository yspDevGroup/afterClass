/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import ProForm, {
    ProFormSelect,
} from '@ant-design/pro-form';
import styles from '../index.less';
import ProCard from '@ant-design/pro-card';
import type { BJType, RoomType, GradeType, SiteType, CourseType } from '../data';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message } from 'antd';
import { getAllFJLX } from '@/services/after-class/fjlx';
import { getAllNJSJ } from '@/services/after-class/njsj'
import { getAllKHKCSJ } from '@/services/after-class/khkcsj'
import { getAllKHBJSJ } from '@/services/after-class/khbjsj'
import { getAllFJSJ } from '@/services/after-class/fjsj'
import ExcelTable from '@/components/ExcelTable';
import { createKHPKSJ } from '@/services/after-class/khpksj';
import { getFJPlan } from '@/services/after-class/fjsj';
import { updateKHBJSJ } from '@/services/after-class/khbjsj';


type PropsType = {
    setState?: any;
    xn?: any;
    xq?: any;
    tableDataSource: any[];
    processingData: (value: any) => void
    setTableDataSource: (value: any) => void
};

const AddArranging: FC<PropsType> = (props) => {
    const { setState, xn, xq, tableDataSource, processingData, setTableDataSource } = props;
    const [packUp, setPackUp] = useState(false);
    const [Bj, setBj] = useState<any>();
    const [index, setIndex] = useState();
    const [njId, setNjId] = useState();
    const [kcId, setKcId] = useState();
    const [cdlxId, setCdlxId] = useState();
    const [colors, setColors] = useState();
    const [cdmcData, setCdmcData] = useState<any>([]);
    const [roomType, setRoomType] = useState<any>([]);
    const [gradeType, setGradeType] = useState<any>([]);
    const [siteType, setSiteType] = useState<any>([]);
    const [kcType, setKcType] = useState<any>([]);
    const [bjData, setBjData] = useState<any>([]);
    // const handleMenuClick = (e: any) => {
    //     console.log('click', e.key);
    //     setColors(e.key);
    // }
    async function handleMenuClick(e: any) {
        console.log('click', e.key);
        setColors(e.key);
        if (Bj?.id) {
            const params = {
                id: Bj?.id,
            };
            const options = {
                KBYS: e.key,
            }
            const updateBj = await updateKHBJSJ(params, options);
            console.log(updateBj)
        }

    }

    const menu = (
        <Menu onClick={handleMenuClick} className='colors'>
            <Menu.Item key="rgba(255, 213, 65, 1)" style={{ backgroundColor: 'rgba(255, 213, 65, 1)' }}>
            </Menu.Item>
            <Menu.Item key="rgba(218, 233, 76, 1)" style={{ backgroundColor: 'rgba(218, 233, 76, 1)' }} >
            </Menu.Item>
            <Menu.Item key="rgba(255, 137, 100, 1)" style={{ backgroundColor: 'rgba(255, 137, 100, 1)' }}>
            </Menu.Item>
            <Menu.Item key="rgba(125, 206, 129, 1)" style={{ backgroundColor: 'rgba(125, 206, 129, 1)' }}>
            </Menu.Item>
            <Menu.Item key="rgba(100, 213, 227, 1)" style={{ backgroundColor: 'rgba(100, 213, 227, 1)' }}>
            </Menu.Item>
            <Menu.Item key="rgba(99, 181, 246, 1)" style={{ backgroundColor: 'rgba(99, 181, 246, 1)' }}>
            </Menu.Item>
            <Menu.Item key="rgba(149, 118, 204, 1)" style={{ backgroundColor: 'rgba(149, 118, 204, 1)' }}>
            </Menu.Item>
            <Menu.Item key="rgba(240, 97, 145, 1)" style={{ backgroundColor: 'rgba(240, 97, 145, 1)' }}>
            </Menu.Item>
        </Menu>
    );

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
    const arr: any[] = [];
    const onExcelTableClick = (value: any) => {
        console.log('onExcelTableClickvalue', value);
        if (JSON.stringify(value) === '{}') {
            arr.splice(arr.length - 1)
        } else {
            arr.push(value)
        }

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
        try {
            const result = await createKHPKSJ(arr);
            console.dir(result);
            if (result.status === 'ok') {
                if (arr.length === 0) {
                    message.info('请添加排课信息')
                } else {
                    message.success('保存成功');
                    setState(true)
                    return true;
                }
            } else {
                message.error('保存失败')
            }
        } catch (err) {
            console.log(err)
            message.error('保存失败')
            return true;
        }

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
                    xn,
                    xq,
                    page: 0,
                    pageCount: 0,
                    name: ''
                });
                setBjData(bjList.data)
                console.log(bjList)
                // 获取所有课程数据
                const kcList = await getAllKHKCSJ({
                    xn,
                    xq,
                    page: 0,
                    pageCount: 0,
                    name: ''
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
        cla: Bj ? Bj.BJMC : '',
        teacher: Bj ? Bj.ZJS : '',
        XNXQId: Bj ? Bj.KHKCSJ.XNXQId : '',
        KHBJSJId: Bj ? Bj.id : '',
        color: colors || '',
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
                                xn,
                                xq,
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
                                xn,
                                xq,
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
                        bjData && bjData.length < 15 ?
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
                            const Fjplan = await getFJPlan({
                                lxId: value,
                                fjId: '',
                                xn,
                                xq
                            });
                            if (Fjplan.status === 'ok') {
                                const data = processingData(Fjplan.data)
                                setTableDataSource(data)
                            } else {
                                message.error(Fjplan.message);
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
                        async onChange(value, index) {
                            setCdmcData(value);
                            console.log(value)
                            // 查询房间占用情况
                            const Fjplan = await getFJPlan({
                                lxId: cdlxId === undefined ? '' : cdlxId,
                                fjId: value,
                                xn,
                                xq
                            });
                            if (Fjplan.status === 'ok') {
                                const data = processingData(Fjplan.data)
                                console.log('datadatadata', data);
                                setTableDataSource(data)
                                console.log(Fjplan)
                            } else {
                                message.error(Fjplan.message);
                            }
                        }
                    }}
                />

                <Dropdown overlay={menu} className='btn' >
                    <Button >
                        颜色选择 <DownOutlined />
                    </Button>
                </Dropdown>

                <div className='site'>
                    <span>场地：</span>
                    <ExcelTable
                        className={styles.borderTable}
                        columns={columns}
                        dataSource={tableDataSource}
                        chosenData={chosenData}
                        onExcelTableClick={onExcelTableClick}
                        type='edit'
                    />
                </div>
            </ProForm>

        </div>)

};

export default AddArranging;