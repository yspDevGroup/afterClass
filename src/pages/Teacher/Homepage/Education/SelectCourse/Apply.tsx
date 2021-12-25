/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-11-29 17:16:51
 * @LastEditTime: 2021-12-10 13:21:58
 * @LastEditors: zpl
 */
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import dayjs from 'dayjs';
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';
import {
  Button,
  ConfigProvider,
  DatePicker,
  Divider,
  List,
  message,
  Modal,
  Radio,
  Tag,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import GoBack from '@/components/GoBack';
import ShowName from '@/components/ShowName';
import { getAllNJSJ } from '@/services/after-class/njsj';
// import { getAllXQSJ } from '@/services/after-class/xqsj';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { getNoTeacherClasses } from '@/services/after-class/khbjsj';
import { createKHBJJSRL, getAll } from '@/services/after-class/khbjjsrl';
import { ParentHomeData } from '@/services/local-services/mobileHome';

import noOrder from '@/assets/noOrder1.png';
import styles from './index.less';

const { confirm } = Modal;
const Study = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const userId = currentUser.JSId || testTeacherId;
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const divRef = useRef<HTMLDivElement | null>(null);
  const [XNXQId, setXNXQId] = useState<string>();
  // const [XQId, setXQId] = useState<any>();
  // const [XQData, setXQData] = useState<any>();
  // 年级
  const [NjId, setNjId] = useState<string>();
  const [NjVal, setNjVal] = useState<string>();
  const [NjData, setNjData] = useState<any[]>();
  // 课程类型
  const [LXId, setLXId] = useState<string>();
  const [LXVal, setLXVal] = useState<string>();
  const [kclxOptions, setOptions] = useState<any[]>([]);
  // 课程数据
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 当前课程
  const [current, setCurrent] = useState<any>();
  // 当前课程主教师
  const [mainTeacher, setMainTeacher] = useState<any>();
  // 当前课程副教师
  const [subTeacher, setSubTeacher] = useState<any>([]);
  // 获取未指定教师的课程信息
  const getData = async () => {
    const res = await getNoTeacherClasses({
      XNXQId,
      RQ: day,
      NJSJId: NjId,
      KHKCLXId: LXId,
    });
    if (res.status === 'ok') {
      setDataSource(res.data);
    }
  };
  // 获取当前课程是否已有认领数据
  const getCurTeacher = async () => {
    const { XXSJPZ } = current.KHPKSJs?.[0];
    const res = await getAll({
      RQ: day,
      XXJBSJId: currentUser.xxId,
      XNXQId,
      KHBJSJId: current.id,
      XXSJPZId: XXSJPZ?.id,
      page: 0,
      pageSize: 0,
    });
    if (res.status === 'ok' && res.data) {
      const { rows } = res.data;
      if (rows?.length) {
        const main = rows.find((v) => v.JSLX === 1);
        const subs = rows.filter((v) => v.JSLX === 0);
        setMainTeacher(main);
        setSubTeacher(subs);
      } else {
        setMainTeacher(undefined);
        setSubTeacher([]);
      }
    }
  };
  // 创建/更新课程认领数据
  const claimCourse = async (mainId?: string, subIds?: string[], own?: boolean) => {
    const { XXSJPZ } = current.KHPKSJs?.[0];
    const res = await createKHBJJSRL({
      RQ: day,
      KHBJSJId: current.id,
      BZRId: mainId,
      FBZRIds: subIds || [],
      XXSJPZId: XXSJPZ?.id,
    });
    if (res.status === 'ok') {
      message.success(own ? '本节课无需代课，请知悉' : '选课成功，请注意按时上课');
      setCurrent(undefined);
      setMainTeacher(undefined);
      setSubTeacher([]);
    } else {
      message.warning('选课失败');
    }
  };
  // 提交前预判
  const prevJudge = () => {
    const mainId = mainTeacher?.JZGJBSJ?.id;
    const subIds = [].map.call(subTeacher, (v: any) => {
      return v?.JZGJBSJ?.id;
    });
    if (mainId === userId || subIds?.includes(userId)) {
      claimCourse(mainId, subIds as string[]);
    } else {
      confirm({
        title: `${current?.KHKCSJ?.KCMC} - ${current?.BJMC}`,
        icon: <ExclamationCircleOutlined />,
        content: '是否确认不对本节课程进行代课？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          claimCourse(mainId, subIds as string[], true);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData(
        'teacher',
        currentUser?.xxId,
        currentUser.JSId || testTeacherId,
      );
      const { xnxqId } = oriData.data;
      setXNXQId(xnxqId);
      // 获取年级列表
      const res = await getAllNJSJ({
        XD: currentUser?.XD?.split(','),
      });
      if (res.status === 'ok' && res.data) {
        setNjData(res.data?.rows);
      }
      // 获取校区列表
      // const res1: any = await getAllXQSJ({
      //   XXJBSJId: currentUser?.xxId,
      // });
      // if (res1.status === 'ok' && res1?.data) {
      //   setXQData(res1?.data);
      // }
      // 课程类型
      const res2 = await getAllKHKCLX({ name: '' });
      if (res2.status === 'ok') {
        const opt: any[] = [];
        res2.data?.map((item: any) => {
          return opt.push({
            label: item.KCTAG,
            value: item.id,
          });
        });
        setOptions(opt);
      }
    })();
  }, []);
  useEffect(() => {
    getData();
  }, [XNXQId, NjId, LXId, day]);
  useEffect(() => {
    if (current) {
      getCurTeacher();
    }
  }, [current]);
  const onChange = (date: any, dateString: any) => {
    setDay(dateString);
    divRef!.current!.style.display = 'none';
  };
  const handleSearch = (e: any, type: string) => {
    const tar = e.target as HTMLSpanElement;
    e.stopPropagation();
    if (tar) {
      const parent = tar.parentElement;
      if (parent) {
        const { children: childrenNew } = parent;
        const wrapper = parent.nextElementSibling as HTMLDivElement;
        if (tar.className === 'activeCls') {
          if (wrapper) {
            if (wrapper.style.display === 'none') {
              wrapper.style.display = 'block';
              return;
            }
            tar.className = '';
            wrapper.style.display = 'none';
          }
        } else {
          (childrenNew as unknown as [])?.forEach((element: HTMLDivElement) => {
            // eslint-disable-next-line no-param-reassign
            element.className = '';
          });
          tar.className = 'activeCls';
          if (wrapper) {
            wrapper.style.display = 'block';
          }
        }
        if (wrapper && wrapper.children?.[0]) {
          const { children } = wrapper.children[0];
          (children as unknown as [])?.forEach((element: HTMLDivElement) => {
            // eslint-disable-next-line no-param-reassign
            element.style.display = 'none';
          });
          if (tar.className !== '') {
            switch (type) {
              case 'grade':
                (children[0] as HTMLDivElement).style.display = 'block';
                break;
              case 'type':
                (children[1] as HTMLDivElement).style.display = 'block';
                break;
              case 'date':
                (children[2] as HTMLDivElement).style.display = 'block';
                break;
              default:
                break;
            }
          }
        }
      }
    }
  };
  const handleChange = (e: any) => {
    const type = e.target.value;
    if (type === '1') {
      setMainTeacher({
        JZGJBSJ: {
          id: userId,
          XM: currentUser.XM,
          wechatUserId: currentUser.wechatUserId,
        },
      });
    }
    if (type === '0') {
      if (subTeacher?.length >= 3) {
        message.warning('副班教师最多可为3人，目前人数已满。');
      } else {
        const exited = subTeacher?.find((v: any) => v?.JZGJBSJ?.id === userId);
        if (exited) {
          message.warning('当前教师已存在。');
        } else {
          const nowSubs = subTeacher.concat([
            {
              JZGJBSJ: {
                id: userId,
                XM: currentUser.XM,
                wechatUserId: currentUser.wechatUserId,
              },
            },
          ]);
          setSubTeacher(nowSubs);
        }
      }
    }
  };
  return (
    <div className={styles.selectedPage}>
      <GoBack title="我要选课" teacher onclick="/teacher/education/selectCourse" />
      <div className={styles.selectedCard}>
        <div className={styles.selectedCon}>
          <div className={styles.searchVal}>
            {/* <span>全校区</span> */}
            <span onClick={(e) => handleSearch(e, 'grade')}>{NjVal || '全年级'}</span>
            <span onClick={(e) => handleSearch(e, 'type')}>{LXVal || '全部课程'}</span>
            <span onClick={(e) => handleSearch(e, 'date')}>
              {moment(day).format('MM月DD日') || '今天'}
            </span>
          </div>
          <div
            className="searchWrapper"
            ref={divRef}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.currentTarget.style.display = 'none';
              }
            }}
          >
            <div>
              {/* <div>
                <ul>
                  {XQData?.map((item: any) => {
                    return <li key={item.id} onClick={() => setXQId(item.id)}>{item.XQMC}</li>;
                  })}
                </ul>
              </div> */}
              <div className="gradeWrapper">
                <ul>
                  <li
                    className={NjId === undefined ? styles.active : ''}
                    key={undefined}
                    onClick={() => {
                      setNjId(undefined);
                      setNjVal('全年级');
                      divRef!.current!.style.display = 'none';
                    }}
                  >
                    全年级
                  </li>
                  {NjData &&
                    NjData?.map((item: any) => {
                      return (
                        <li
                          className={NjId === item.id ? styles.active : ''}
                          key={item.id}
                          onClick={() => {
                            setNjId(item.id);
                            setNjVal(`${item.XD}${item.NJMC}`);
                            divRef!.current!.style.display = 'none';
                          }}
                        >{`${item.XD}${item.NJMC}`}</li>
                      );
                    })}
                </ul>
              </div>
              <div className="typeWrapper">
                <ul>
                  <li
                    className={LXId === undefined ? styles.active : ''}
                    key={undefined}
                    onClick={() => {
                      setLXId(undefined);
                      setLXVal('全部课程');
                      divRef!.current!.style.display = 'none';
                    }}
                  >
                    全部课程
                  </li>
                  {kclxOptions &&
                    kclxOptions?.map((item: any) => {
                      return (
                        <li
                          className={LXId === item.value ? styles.active : ''}
                          key={item.value}
                          onClick={() => {
                            setLXId(item.value);
                            setLXVal(item.label);
                            divRef!.current!.style.display = 'none';
                          }}
                        >
                          {item.label}
                        </li>
                      );
                    })}
                </ul>
              </div>
              <div className="dateWrapper">
                <ConfigProvider locale={locale}>
                  <DatePicker
                    style={{ width: '100%' }}
                    bordered={false}
                    allowClear={false}
                    inputReadOnly={true}
                    value={moment(day)}
                    onChange={onChange}
                  />
                </ConfigProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.listWrapper}>
        {dataSource?.length ? (
          <List
            style={{ background: '#fff', paddingLeft: '10px' }}
            itemLayout="horizontal"
            dataSource={dataSource}
            renderItem={(item: any) => {
              const { XXSJPZ, FJSJ } = item.KHPKSJs?.[0];
              return (
                <List.Item
                  key={`${item.id}+${item.BMKSSJ}`}
                  actions={[
                    <input
                      name="Fruit"
                      type="radio"
                      value={`${item.id}+${item.BMKSSJ}`}
                      onClick={() => {
                        setCurrent(item);
                      }}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={`${item?.KHKCSJ?.KCMC}【${item?.BJMC}】`}
                    description={`${XXSJPZ?.KSSJ?.substring?.(0, 5)} - ${XXSJPZ?.JSSJ?.substring?.(
                      0,
                      5,
                    )} | ${FJSJ.FJMC}`}
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <div className={styles.noData}>
            <img src={noOrder} alt="" />
            <p>暂无数据</p>
          </div>
        )}
      </div>
      {current ? (
        <div
          className={styles.applyWrapper}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCurrent(undefined);
              setMainTeacher(undefined);
              setSubTeacher([]);
            }
          }}
        >
          <div>
            <div className={styles.title}>{`${current?.KHKCSJ?.KCMC} - ${current?.BJMC}`}</div>
            <div className={styles.content}>
              <div className={styles.items}>
                <span>主班教师</span>
                <div>
                  {mainTeacher ? (
                    <Tag
                      closable={mainTeacher?.JZGJBSJ?.id === userId}
                      onClose={() => {
                        setMainTeacher(undefined);
                      }}
                    >
                      <ShowName
                        type="userName"
                        openid={mainTeacher?.JZGJBSJ?.WechatUserId}
                        XM={mainTeacher?.JZGJBSJ?.XM}
                      />
                    </Tag>
                  ) : (
                    <span className={styles.tipText}>暂无安排</span>
                  )}
                </div>
              </div>
              <div className={styles.items}>
                <span>
                  副班教师<span className={styles.tipText}>（最多3人）</span>
                </span>
                <div>
                  {subTeacher?.length ? (
                    <>
                      {subTeacher.map((v: any) => {
                        return (
                          <Tag
                            closable={v?.JZGJBSJ?.id === userId}
                            onClose={() => {
                              const subs = subTeacher.filter(
                                (val: any) => val.JZGJBSJ?.id !== userId,
                              );
                              setSubTeacher(subs);
                            }}
                          >
                            <ShowName
                              type="userName"
                              openid={v?.JZGJBSJ?.WechatUserId}
                              XM={v?.JZGJBSJ?.XM}
                            />
                          </Tag>
                        );
                      })}{' '}
                    </>
                  ) : (
                    <span className={styles.tipText}>暂无安排</span>
                  )}
                </div>
              </div>
              <Divider />
              <div className={styles.items}>
                <div>
                  <h3>
                    选择角色
                    <span
                      style={{ display: mainTeacher ? 'block' : 'none' }}
                      className={styles.tipText}
                    >
                      已有主班教师
                    </span>
                  </h3>
                </div>
                <Radio.Group>
                  <Radio.Button
                    onClick={(e) => handleChange(e)}
                    disabled={mainTeacher && mainTeacher?.JZGJBSJ?.id !== userId}
                    value="1"
                  >
                    主班
                  </Radio.Button>
                  <Radio.Button onClick={(e) => handleChange(e)} value="0">
                    副班
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
            <Button className={styles.submit} onClick={() => prevJudge()}>
              提交
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Study;
