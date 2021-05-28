/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-24 16:33:45
 * @LastEditTime: 2021-05-27 18:37:59
 * @LastEditors: txx
 */

import { useState, useEffect } from 'react';
import { Input, message, Select, } from 'antd';
import type { FC } from 'react';

import { dataSource } from './mock';
import styles from "./index.less";
import { getAllXNXQ } from '@/services/after-class/xnxq';

const convertData = (data: API.XNXQ[]) => {
  const chainData: {
    data: { title: string, key: string }[],
    subData: Record<string, { title: string; key: string }[]>
  } = {
    data: [],
    subData: {}
  }
  data.forEach((item) => {
    const { XN, XQ } = item;
    if (!chainData.data.find((d) => d.key === XN)) {
      chainData.data.push({ title: XN, key: XN })
    }
    if (chainData.subData[XN]) {
      chainData.subData[XN].push({ title: XQ, key: XQ })
    } else {
      chainData.subData[XN] = [{ title: XQ, key: XQ }]
    }
  });
  return chainData;
}

type ISearchComponent = {
  /** 需要搜索时为true */
  isSearch?: boolean;
  /** 需要选中下拉时为true */
  isSelect?: boolean;
  /** 需要联动下拉时为true */
  isChainSelect?: boolean;
  /** 学年学期数据改变的方法 */
  onXNXQChange?: (xn: string, xq: string) => void;
}

type ChainDataType = {
  data: { title: string, key: string }[],
  subData: Record<string, { title: string; key: string }[]>
}

const { Search } = Input;
const { Option } = Select;
const onSearch = (value: any) => console.log(value);

const SearchComponent: FC<ISearchComponent> = ({ isSearch, isSelect, isChainSelect, onXNXQChange }) => {
  const { itemRecourse } = dataSource;

  const [chainData, setchainData] = useState<ChainDataType>()
  const [currentXN, setCurrentXN] = useState<string>()

  const [terms, setTerms] = useState<{ title: string; key: string }[]>();
  const [curTerm, setCurTerm] = useState<string>();

  useEffect(() => {
    (async () => {
      const res = await getAllXNXQ({})
      if (res.status === 'ok') {
        const { data = [] } = res;
        const newData = convertData(data);
        setchainData(newData)
        setCurrentXN(newData.data[0].key)
        const ter = newData.subData[newData.data[0].key]
        setTerms(ter)
        setCurTerm(ter[0].key)
      } else {
        message.warn('')
      }
    })()
  }, [])

  const handleChainChange = (value: string) => {
    setCurrentXN(value);
    const ter = chainData?.subData[value] || []
    setTerms(ter)
    if (ter.length) {
      setCurTerm(ter[0].key)
      if (onXNXQChange) onXNXQChange(value, ter[0].key)
    }
  };
  const onTermChange = (value: any) => {
    setCurTerm(value);
    if (onXNXQChange) onXNXQChange(currentXN!, value)
  };
  return (
    <div className={styles.Header}>
      {itemRecourse.map((item) => {
        const { label, type, placeHolder = '请输入', isLabel = true, data } = item;
        switch (type) {
          case 'chainSelect':
            return <div style={{ display: "inline-block" }}>
              {isChainSelect === true ?
                (<div>
                  <div className={styles.HeaderLable}>{label}</div>
                  <div className={styles.HeaderSelect}>
                    <span className={styles.HeaderSelectOne}>
                      <Select onChange={handleChainChange} value={currentXN} style={{ width: 120 }} >
                        {chainData?.data?.map((year: any) => (
                          <Option value={year.key}>{year.title}</Option>
                        ))}
                      </Select>
                    </span>
                    <span className={styles.HeaderSelectTwo}>
                      <Select onChange={onTermChange} value={curTerm} style={{ width: 120 }}>
                        {terms?.map((term: any) => (
                          <Option value={term.key}>{term.title}</Option>
                        ))}
                      </Select>
                    </span>
                  </div>
                </div>)
                :
                (<></>)}

            </div>
          case 'select':
            return <div style={{ display: "inline-block" }}>

              {isSelect === true ?
                (<div>
                  <div className={styles.HeaderLable}>{label}</div>
                  <div className={styles.HeaderSelect}>
                    <span className={styles.HeaderSelectTwo}>
                      <Select defaultValue={data![0].title} style={{ width: 120 }}>
                        {data?.map((op: any) => <Option value={op.key}>{op.title}</Option>)}
                      </Select>
                    </span>
                  </div>
                </div>)
                :
                (<></>)}

            </div>
          case 'input':
            return <div style={{ display: "inline-block" }}>
              {isSearch === true ?
                (<div className={styles.HeaderSearch} >
                  {isLabel ? <span>{label}</span> : ''}
                  <Search
                    placeholder={placeHolder}
                    onSearch={onSearch}
                    style={{ width: 200 }}
                  />
                </div>)
                :
                (<></>)
              }

            </div>;
            break;
          default:
            return <></>
        }
      })}
    </div >
  )
}
export default SearchComponent