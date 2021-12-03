/*
 * @Author: your name
 * @Date: 2021-11-22 15:41:26
 * @LastEditTime: 2021-12-03 16:35:38
 * @LastEditors: Wu Zhan
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \afterClass\src\pages\Manager\ClassManagement\components\SingUp\index.tsx
 */

import { getClassStudents, getSchoolClasses } from '@/services/after-class/bjsj';
import { Tree, Input, Row, Col, message, Spin, Empty } from 'antd';
import { getAllXSJBSJ } from '@/services/after-class/xsjbsj';
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
  icon?: any;
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
  const [searchValue, setSearchValue] = useState<string | undefined>();

  // 搜索所用到的树以及 班级和年级
  const [searchTreeData, setSearchTreeData] = useState<DataNode[] | undefined>();
  const [searchFalg, setSearchFalg] = useState<boolean>(false);
  const [searchNJ, setSearchNJ] = useState<string[] | undefined>(undefined);
  const [searchBJ, setSearchBJ] = useState<string[] | undefined>(undefined);

  // 搜索缓存
  const [localSearchCache, setLocalSearchCache] = useState<any[]>([]);

  useEffect(() => {
    if (applicantData) {
      // 根据报名类型和班级类型进行判断是否是批量操作
      // 1. BMLX 0先报名后缴费 1 缴费后自动报名 2免费
      // 2. BJLX 0 按年级 1 按行政班

      if (applicantData?.BJLX === 0) {
        const { NJSJs } = applicantData?.KHKCSJ;
        if (NJSJs.length > 0) {
          const newTreeData: DataNode[] = [];
          const NJArr: string[] = [];
          NJSJs.forEach((item: any) => {
            const NJData = {
              title: `${item.XD}${item.NJMC}`,
              key: item.id,
              type: 'NJ',
              selectable: false,
            };
            newTreeData.push(NJData);
            NJArr.push(item.id);
          });
          setTreeData(newTreeData);
          if (NJArr.length) {
            setSearchNJ(NJArr);
          }
        }
      } else if (applicantData?.BJLX === 1) {
        const { BJSJs } = applicantData;

        if (BJSJs?.length > 0) {
          const arr: DataNode[] = [];
          const BJArr: string[] = [];
          BJSJs.forEach((item: any) => {
            BJArr.push(item.id);
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
          if (BJArr?.length) {
            setSearchBJ(BJArr);
          }
          setTreeData(arr);
        }
      }
    }
  }, [applicantData]);

  const onSignUpSubmit = async () => {
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
      setLoading(true);
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
        if (setVisible) {
          setVisible(false);
        }
        message.error(res.message);
      }

      setLoading(false);
    } else {
      message.error('请选择学生');
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
          // 判断是否请求过
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

  const getXH = (XH: string) => {
    if (XH !== null && XH.length > 4) {
      return `~${XH.substring(XH.length - 4)}`;
    } else {
      return `~ ${XH}`;
    }
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
          XQSJId: applicantData?.XQSJId,
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
            }
            if (type === 'BJ') {
              return {
                title: `${item.XM}${getXH(item.XH)}`,
                key: item.id,
                isLeaf: true,
                record: item,
                icon: <UserOutlined style={{ color: '#999' }} />,
              };
            }
            return {};
          });
        }
        if (treeData) {
          const newTreeData = updateTreeData(treeData, key, arr);
          setTreeData(newTreeData);
        }
      }
    });
  };

  const onSelect = (
    selectedKeys: any[],
    e: {
      event: 'select';
      selected: boolean;
      selectedNodes: any;
      node: any;
      nativeEvent: MouseEvent;
    },
  ) => {
    // console.log('selectedNodes',e.selected, e.selectedNodes);
    console.log('selectedKeys', selectedKeys);

    // 判断选中还是移除 true 添加 false移除
    const newSelectedKeys = new Set(selectedKeys);

    // 添加
    if (e?.selected) {
      // 判断是否请求过数据 没有请求过数据需要请求数据 然后进行选中操作
      if (!e?.node?.isRequest) {
        // 班级选择
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
                    title: `${item.XM}${getXH(item.XH)}`,
                    key: item.id,
                    isLeaf: true,
                    record: item,
                    icon: <UserOutlined style={{ color: '#999' }} />,
                  };
                });
              }
              if (treeData) {
                const newTreeData = updateTreeData(treeData, e?.node?.key, arr);
                setTreeData(newTreeData);
                setSelectedKey(Array.from(newSelectedKeys));
              }
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
        setSelectedKey(Array.from(newSelectedKeys));
      }
    } else {
      // 移除判断是否是班级如果是班级移除班级内的学生
      if (e?.node?.type === 'BJ') {
        // 移除班级学生
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
    if (treeData?.length) {
      let newArr: DataNode[] = [];
      const obj = JSON.stringify(treeData);
      newArr = JSON.parse(obj);
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
                  selectNumber = selectNumber + 1;
                  // 移除 copySelectedKey 数组中班级下选择的学生
                  const findIndex = copySelectedKey.findIndex((v: string) => v === XXItem.key);
                  if (findIndex >= 0) {
                    copySelectedKey.splice(findIndex, 1);
                  }
                }
              });
              if (children.length > 0) {
                BJData.children = children;
              }
              // 移除 copySelectedKey 数组中班级
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
                  // 移除 copySelectedKey 数组中班级下选择的学生
                  const findIndex = copySelectedKey.findIndex((v: string) => v === XXItem.key);
                  if (findIndex >= 0) {
                    copySelectedKey.splice(findIndex, 1);
                  }
                  selectNumber = selectNumber + 1;
                  arr.push(XXData);
                }
              });
            }
          });
        }
      });
      console.log('copySelectedKey', copySelectedKey);
      //如果还存在未选择的key 则这个值肯定是搜索出来剩下的 所以需要添加setSelectTreeData到上面去
      if (copySelectedKey.length) {
        copySelectedKey.forEach((item: any) => {
          localSearchCache?.forEach((searchItem: any) => {
            if (item === searchItem.id) {
              selectNumber += 1;
              arr.push({
                title: `${searchItem.XM}${getXH(searchItem.XH)}`,
                key: searchItem.id,
                isLeaf: true,
                icon: <UserOutlined style={{ color: '#999' }} />,
              });
            }
          });
        });
      }
      if (setSelectNumber) {
        setSelectNumber(selectNumber);
      }
      // 移除搜索后的内容
      if (searchFalg) {
        setSearchFalg(false);
        setSearchValue(undefined);
        // setSearchTreeData([]);
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

  // 搜索改变
  const onSearchChange = async (value: string) => {
    // console.log('value',value);
    if (value) {
      const data: {
        XQId: string;
        page: number;
        pageSize: number;
        keyWord: string;
        NJId?: string[];
        BJId?: string[];
      } = {
        XQId: applicantData?.XQSJId,
        page: 0,
        pageSize: 0,
        keyWord: value,
      };

      // 根据课程班范围
      if (applicantData?.BJLX === 0) {
        data.NJId = searchNJ;
      } else {
        data.BJId = searchBJ;
      }
      const res: any = await getAllXSJBSJ(data);
      if (res?.status === 'ok') {
        console.log('res', res);
        setSearchFalg(true);
        const { rows } = res?.data;
        if (rows.length) {
          const newArr = rows.map((item: any) => {
            return {
              title: `${item.XM}${getXH(item.XH)}`,
              key: item.id,
              isLeaf: true,
              record: item,
              icon: <UserOutlined style={{ color: '#999' }} />,
            };
          });

          setSearchTreeData(newArr);
          // 缓存搜索过来的数据进行缓存
          // 首先去重
          const arr = rows?.filter(
            (row: any) => !localSearchCache.some((item: any) => item.id === row.id),
          );
          if (arr?.length) {
            setLocalSearchCache([...localSearchCache, ...arr]);
          }
        } else {
          setSearchTreeData([]);
        }
      }
    } else {
      setSearchFalg(false);
      setSearchTreeData([]);
    }
  };
  console.log(' SearchFalg', searchFalg);

  return (
    <Spin spinning={loading}>
      <Row gutter={12} justify="space-between">
        <Col span={11} style={{ height: '380px' }}>
          <Search
            style={{ marginBottom: 8 }}
            value={searchValue}
            onChange={(e: any) => {
              setSearchValue(e?.target?.value);
            }}
            placeholder="姓名/学号"
            allowClear
            onSearch={onSearchChange}
          />
          <Tree
            height={333}
            selectable
            multiple
            loadData={onLoadData}
            treeData={searchFalg ? searchTreeData : treeData}
            onSelect={onSelect}
            showIcon
            selectedKeys={selectedKey}
            // eslint-disable-next-line @typescript-eslint/no-shadow
            titleRender={(node: any) => {
              // 判断是否选中改变title选中状态
              if (node.type === 'NJ') {
                return node.title;
              }
              const selectItem = selectedKey?.find((v: string) => v === node?.key);
              if (selectItem) {
                return (
                  <span>
                    {node.title}
                    <CheckOutlined style={{ marginLeft: '1em', color: '#4884ff' }} />
                  </span>
                );
              }
              return node?.title;
            }}
          />
          {searchFalg && searchTreeData?.length === 0 && <Empty />}
        </Col>
        <div style={{ borderRight: '1px solid #999' }} />
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
