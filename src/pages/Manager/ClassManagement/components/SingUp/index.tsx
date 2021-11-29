/*
 * @Author: your name
 * @Date: 2021-11-22 15:41:26
 * @LastEditTime: 2021-11-27 11:05:08
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \afterClass\src\pages\Manager\ClassManagement\components\SingUp\index.tsx
 */

import { getClassStudents, getSchoolClasses } from '@/services/after-class/bjsj';
import { Tree, Input, Row, Col, message, Spin } from 'antd';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useModel } from 'umi';
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  InsertRowAboveOutlined,
} from '@ant-design/icons';
import styles from './index.less';

import { studentRegistration } from '@/services/after-class/khbjsj';

const { Search } = Input;

// 学生报名
type SignUpProps = {
  applicantData: any;
  ref: any;
  setVisible: any;
  setSelectNumber: any;
  onsetKHXSBJs: any;
};

type DataNode = {
  title: string;
  key: string;
  isLeaf?: boolean;
  type?: string;
  children?: DataNode[];
  isRequest?: boolean;
  selectable?: boolean;
};
// 学生报名
const SignUp = (props: SignUpProps, ref: any) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const { applicantData, setVisible, setSelectNumber, onsetKHXSBJs } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const [treeData, setTreeData] = useState<DataNode[]>();
  const [selectTreeData, setSelectTreeData] = useState<DataNode[]>();
  const [selectedKey, setSelectedKey] = useState<string[]>([]);
  // const [selectedNode,setSelectedNodes]=useState<DataNode[]>([]);

  useEffect(() => {
    if (applicantData) {
      //根据报名类型和班级类型进行判断是否是批量操作
      // 1. BMLX 0先报名后缴费 1 缴费后自动报名 2免费
      // 2. BJLX 0 按年级 1 按行政班
      // console.log('applicantData', applicantData);
      if (applicantData?.BJLX === 0) {
        const { NJSJs } = applicantData?.KHKCSJ;
        if (NJSJs.length > 0) {
          const newTreeData: DataNode[] = [];
          NJSJs.forEach((item: any) => {
            const NJData = {
              title: `${item.XD}${item.NJMC}`,
              key: item.id,
              type: 'NJ',
              selectable: false,
            };
            newTreeData.push(NJData);
          });
          setTreeData(newTreeData);
        }
      } else if (applicantData?.BJLX === 1) {
        const { BJSJs } = applicantData;

        if (BJSJs?.length > 0) {
          const arr: DataNode[] = [];
          BJSJs.forEach((item: any) => {
            if (item?.NJSJ) {
              const NJData = {
                title: `${item?.NJSJ?.XD}${item?.NJSJ?.NJMC}`,
                key: item?.NJSJ?.id,
                type: 'NJ',
                children: [],
                selectable: false,
              };
              const BJData = {
                title: `${item.BJ}`,
                key: item.id,
                type: 'BJ',
                icon: <InsertRowAboveOutlined style={{ color: '#666' }} />,
              };
              if (!arr.some((v: DataNode) => v.key === NJData.key)) {
                arr.push(NJData);
              }
              arr.forEach((v: DataNode) => {
                if (v.key === item?.NJSJ?.id) {
                  v.children?.push(BJData);
                }
              });
            }
          });
          // console.log('arr', arr);
          setTreeData(arr);
        }
      }
    }
  }, [applicantData]);

  const onSignUpSubmit = async () => {
    setLoading(true);
    const XSJBSJIds: string[] = [];
    selectTreeData?.forEach((BJItem: DataNode) => {
      if (BJItem?.type === 'BJ') {
        BJItem?.children?.forEach((XXItem: DataNode) => {
          if (XXItem?.key) {
            XSJBSJIds.push(XXItem.key);
          }
        });
      } else {
        // 学生
        XSJBSJIds.push(BJItem.key);
      }
    });

    if (XSJBSJIds.length) {
      const res = await studentRegistration({
        // 0 正常 1退课申请 2 已退款 3未付款 如果报名时免费 0 先报名后缴费 3
        ZT: applicantData.BMLX === 2 ? 0 : 3,
        XSJBSJIds,
        KHBJSJId: applicantData.id,
        // XXId:applicantData?.KHKCSJ?.XXJBSJId,
        // XNXQIId: applicantData?.XNXQId,
      });
      if (res.status === 'ok') {
        message.success('报名成功');
        if (setVisible) {
          setVisible(false);
        }
        if (setSelectNumber) {
          setSelectNumber(0);
        }
        if (onsetKHXSBJs) {
          onsetKHXSBJs();
        }
      } else {
        message.error(res.message);
      }

      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    onSubmit: () => {
      onSignUpSubmit();
    },
  }));

  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
    return list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          //判断是否请求过
          isRequest: true,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  };

  const onLoadData = ({ key, children, type }: any) => {
    return new Promise<any>((resolve) => {
      if (children) {
        resolve('');
        return;
      }
      if (type === 'NJ') {
        const res = getSchoolClasses({
          njId: key,
          XXJBSJId: currentUser?.xxId,
          XNXQId: applicantData?.XNXQId,
        });
        resolve(res);
        return;
      }
      if (type === 'BJ') {
        const resStudents = getClassStudents({
          XXJBSJId: currentUser?.xxId,
          XNXQId: applicantData?.XNXQId,
          BJSJId: key,
          // njId: item?.id,
          page: 0,
          pageSize: 0,
        });
        resolve(resStudents);
      }
      return;
    }).then((result: any) => {
      if (result?.status === 'ok') {
        const { rows } = result?.data;
        let arr: any[] = [];
        if (rows.length > 0) {
          arr = rows.map((item: any) => {
            if (type === 'NJ') {
              return {
                title: item.BJ,
                key: item.id,
                type: 'BJ',
                icon: <InsertRowAboveOutlined style={{ color: '#666' }} />,
              };
            } else if (type === 'BJ') {
              return {
                title: item.XM,
                key: item.id,
                isLeaf: true,
                record: item,
                icon: <UserOutlined style={{ color: '#999' }} />,
              };
            }
          });
        }
        const newTreeData = updateTreeData(treeData, key, arr);
        setTreeData(newTreeData);
      }
    });
  };

  const onSelect = (
    selectedKeys: any[],
    e: { selected: boolean; selectedNodes: DataNode; node: DataNode },
  ) => {
    // console.log('selectedNodes',e.selected, e.selectedNodes);

    // 判断选中还是移除 true 添加 false移除
    const newSelectedKeys = new Set(selectedKeys);

    // 添加
    if (e?.selected) {
      // 判断是否请求过数据 没有请求过数据需要请求数据 然后进行选中操作
      if (!e?.node?.isRequest) {
        //班级选择
        if (e?.node?.type === 'BJ') {
          const resStudents = getClassStudents({
            XXJBSJId: currentUser?.xxId,
            XNXQId: applicantData?.XNXQId,
            BJSJId: e?.node?.key,
            // njId: item?.id,
            page: 0,
            pageSize: 0,
          });
          new Promise((resolve) => {
            resolve(resStudents);
          }).then((res: any) => {
            if (res?.status === 'ok') {
              const { rows } = res?.data;
              let arr: any[] = [];
              if (rows.length > 0) {
                arr = rows.map((item: any) => {
                  newSelectedKeys.add(item.id);
                  return {
                    title: item.XM,
                    key: item.id,
                    isLeaf: true,
                    record: item,
                    icon: <UserOutlined style={{ color: '#999' }} />,
                  };
                });
              }
              const newTreeData = updateTreeData(treeData, e?.node?.key, arr);

              setTreeData(newTreeData);
              setSelectedKey(Array.from(newSelectedKeys));
            }
          });
        }
        // 学生选择
        if (e?.node?.isLeaf) {
          setSelectedKey(Array.from(newSelectedKeys));
        }
      } else {
        // 班级选择
        if (e?.node?.type === 'BJ') {
          e?.node?.children?.forEach((item: DataNode) => {
            newSelectedKeys.add(item.key);
          });
        }
        // 学生选择
        if (e?.node?.isLeaf) {
        }
        setSelectedKey(Array.from(newSelectedKeys));
      }
    } else {
      //移除判断是否是班级如果是班级移除班级内的学生
      if (e?.node?.type === 'BJ') {
        //移除班级学生
        const newArr = [...newSelectedKeys].filter((key: string) => {
          return !e?.node?.children?.some((item: DataNode) => item?.key === key);
        });
        setSelectedKey(newArr);
      }
      // 学生移除
      if (e?.node?.isLeaf) {
        setSelectedKey(Array.from(newSelectedKeys));
      }
    }
  };

  useEffect(() => {
    if (treeData?.length > 0) {
      const _obj = JSON.stringify(treeData);
      const newArr: DataNode[] = JSON.parse(_obj);
      const arr: DataNode[] = [];
      const copySelectedKey = [...selectedKey];
      let selectNumber = 0;
      newArr?.forEach((NJItem: DataNode) => {
        // 班级
        if (NJItem?.children) {
          NJItem?.children.forEach((BJItem: DataNode) => {
            // 判断copySelectedKey存在 选择了班级
            if (copySelectedKey.some((v: string) => BJItem.key === v)) {
              const BJData: DataNode = {
                ...BJItem,
                title: `${NJItem?.title}${BJItem.title}`,
                children: undefined,
                selectable: false,
              };
              // 学生筛选
              const children: DataNode[] = [];
              BJItem?.children?.forEach((XXItem: DataNode) => {
                const XXData = { ...XXItem, selectable: false };
                if (copySelectedKey.some((v: string) => v === XXItem.key)) {
                  children.push(XXData);
                  selectNumber = ++selectNumber;
                  //移除 copySelectedKey 数组中班级下选择的学生
                  const findIndex = copySelectedKey.findIndex((v: string) => v === XXItem.key);
                  if (findIndex >= 0) {
                    copySelectedKey.splice(findIndex, 1);
                  }
                }
              });
              if (children.length > 0) {
                BJData.children = children;
              }
              //移除 copySelectedKey 数组中班级
              const findIndex = copySelectedKey.findIndex((v: string) => v === BJItem.key);
              if (findIndex >= 0) {
                copySelectedKey.splice(findIndex, 1);
              }
              arr.push(BJData);
            } else {
              // 学生筛选
              BJItem?.children?.forEach((XXItem: DataNode) => {
                const XXData = { ...XXItem, selectable: false };
                if (copySelectedKey.some((v: string) => v === XXItem.key)) {
                  //移除 copySelectedKey 数组中班级下选择的学生
                  const findIndex = copySelectedKey.findIndex((v: string) => v === XXItem.key);
                  if (findIndex >= 0) {
                    copySelectedKey.splice(findIndex, 1);
                  }
                  selectNumber = ++selectNumber;
                  arr.push(XXData);
                }
              });
            }
          });
        }
      });
      console.log('=++++++', selectNumber);
      if (setSelectNumber) {
        setSelectNumber(selectNumber);
      }
      setSelectTreeData(arr);
    }
  }, [selectedKey]);

  /**
   *
   * @param node 将要移除的数据
   */
  const onRemoveClick = (node: DataNode) => {
    // selectTreeData 右边选择的班级学生

    const keys: Set<string> = new Set();
    // const selectedKeySet: Set<string>=new Set([...selectedKey])
    keys.add(node?.key);
    if (node?.type === 'BJ') {
      node?.children?.forEach((XXItem: DataNode) => {
        keys.add(XXItem?.key);
      });
    }
    const arr = new Set(selectedKey.filter((x) => !keys.has(x)));
    //  console.log('arr',Array.from(arr));
    setSelectedKey(Array.from(arr));
  };

  return (
    <Spin spinning={loading}>
      <Row>
        <Col span={12}>
          <div style={{ height: '380px', paddingRight: '5px', borderRight: '1px solid #999' }}>
            <Search style={{ marginBottom: 8 }} placeholder="Search" />
            <Tree
              height={333}
              selectable
              multiple
              loadData={onLoadData}
              treeData={treeData}
              onSelect={onSelect}
              showIcon
              selectedKeys={selectedKey}
              // eslint-disable-next-line @typescript-eslint/no-shadow
              titleRender={(node: any) => {
                // 判断是否选中改变title选中状态
                if (node.type === 'NJ') {
                  return node.title;
                } else {
                  const selectItem = selectedKey?.find((v: string) => v === node?.key);

                  if (selectItem) {
                    return (
                      <span>
                        {node.title}
                        <CheckOutlined style={{ marginLeft: '1em', color: '#4884ff' }} />
                      </span>
                    );
                  } else {
                    return node?.title;
                  }
                }
              }}
            />
          </div>
        </Col>
        <Col span={12}>
          <Tree
            height={333}
            className={styles.removeTree}
            selectable={false}
            blockNode
            treeData={selectTreeData}
            titleRender={(node: any) => {
              return (
                <div className={styles.removeDiv}>
                  {node.title}{' '}
                  <CloseOutlined
                    onClick={() => {
                      onRemoveClick(node);
                    }}
                    style={{ color: '#FF6F6F', cursor: 'pointer' }}
                  />
                </div>
              );
            }}
          />
        </Col>
      </Row>
    </Spin>
  );
};
export default forwardRef(SignUp);
