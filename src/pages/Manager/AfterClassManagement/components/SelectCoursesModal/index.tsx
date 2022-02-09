/*
 * @Author: your name
 * @Date: 2021-11-22 15:41:26
 * @LastEditTime: 2022-02-09 15:40:59
 * @LastEditors: zpl
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Tree, Input, Row, Col, Spin, Empty } from 'antd';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Search } = Input;

//选择课程
type SignUpProps = {
  ref: any;
  dataSource: DataNode[] | undefined;
  selectValue: DataNode[] | undefined;
  onChange: any;
  onSearch?: any;
};

export type DataNode = {
  title: string;
  key: string;
  isLeaf?: boolean;
  type?: 'FL' | 'KC' | 'KCB';
  children?: DataNode[];
  // isRequest?: boolean;
  selectable?: boolean;
  icon?: any;
};
// 选择班级
const SelectCoursesModal = (props: SignUpProps, ref: any) => {
  const { dataSource, selectValue, onSearch } = props;
  // const [loading, setLoading] = useState<boolean>(false);
  const loading = false;
  const [selectedKey, setSelectedKey] = useState<string[]>([]);
  const [selectTreeData, setSelectTreeData] = useState<DataNode[] | undefined>([]);

  useEffect(() => {
    setSelectTreeData(selectValue);
  }, []);

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    getSelcetValue: () => {
      return selectTreeData?.map((item: DataNode) => {
        return { label: item.title, value: item.key };
      });
    },
  }));

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
    console.log('---', selectedKeys, 'e', e);
    console.log('e', e);

    let newSelectTreeData: DataNode[] = [];
    if (selectTreeData) {
      newSelectTreeData = [...selectTreeData];
    }
    let newSelectedKeys: string[] = [...selectedKey];
    // 选中时
    if (e.selected) {
      // 课程
      if (e?.node?.type === 'KC') {
        e?.node?.children.forEach((item: DataNode) => {
          newSelectedKeys.push(item?.key);
          if (!newSelectTreeData?.some((v: DataNode) => v.key === item.key)) {
            newSelectTreeData.push(item);
          }
        });
      } else {
        // 课程班
        if (!newSelectTreeData?.some((v: DataNode) => v.key === e?.node?.key)) {
          newSelectTreeData.push(e?.node);
        }
      }
      newSelectedKeys.push(e?.node?.key);
    } else {
      // 移除时
      if (e?.node?.type === 'KC') {
        e?.node?.children.forEach((item: DataNode) => {
          newSelectedKeys = newSelectedKeys.filter((v: string) => v !== item?.key);
          newSelectTreeData = newSelectTreeData?.filter((v: DataNode) => v.key !== item.key);
        });
      } else {
        newSelectTreeData = newSelectTreeData?.filter((v: DataNode) => v.key !== e?.node?.key);
      }
      newSelectedKeys = newSelectedKeys.filter((v: string) => v !== e.node.key);
    }
    console.log('newSelectedKeys', newSelectedKeys);
    setSelectTreeData(newSelectTreeData);
    setSelectedKey(Array.from(new Set(newSelectedKeys)));
  };

  const onRemoveClick = (node: DataNode) => {
    console.log('onRemoveClick', node);
    setSelectedKey([...selectedKey].filter((item: string) => item !== node.key));
    if (selectTreeData)
      setSelectTreeData([...selectTreeData].filter((item: DataNode) => item.key !== node.key));
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={12} justify="space-between">
        <Col span={11} style={{ height: '380px' }}>
          <Search
            style={{ marginBottom: 8 }}
            // value={searchValue}
            // onChange={(e: any) => {
            //   setSearchValue(e?.target?.value);
            // }}
            placeholder="课程班名称"
            allowClear
            onSearch={(v: string) => {
              onSearch(v);
            }}
          />
          <Tree
            height={333}
            selectedKeys={selectedKey}
            selectable
            multiple
            treeData={dataSource}
            onSelect={onSelect}
            blockNode
            // showIcon
            // selectedKeys={selectedKey}
            titleRender={(node: any) => {
              // 判断是否选中改变title选中状态
              if (node.type !== 'FL') {
                const selectItem = selectedKey?.find((v: string) => v === node?.key);
                if (selectItem) {
                  return (
                    <span className={styles.removeDiv}>
                      {node.title}
                      <CheckOutlined style={{ marginLeft: '1em', color: '#4884ff' }} />
                    </span>
                  );
                }
                return node?.title;
              }
              return node?.title;
            }}
          />
          {dataSource?.length === 0 && <Empty />}
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
export default forwardRef(SelectCoursesModal);
