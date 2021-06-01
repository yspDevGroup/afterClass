/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-24 16:33:45
 * @LastEditTime: 2021-05-29 18:06:33
 * @LastEditors: txx
 */

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Input, Select, } from 'antd';
import styles from "./index.less";
import type { SearchDataType } from './data';

type ISearchComponent = {
    /** 数据类型 */
  dataSource?: SearchDataType;
   /** input值改变的方法 */
  onChange?: any;
}
type ChainDataType = {
   /** 联动一级数据 类型 */
  data: { title: string, key: string }[],
   /** 联动二级数据类型 */
  subData: Record<string, { title: string; key: string }[]>
}

const { Search } = Input;
const { Option } = Select;

const SearchComponent: FC<ISearchComponent> = ({ dataSource, onChange }) => {
  const [chainData, setchainData] = useState<ChainDataType>();// 联动数据
  const [currentXN, setCurrentXN] = useState<string>();// 学年默认值
  const [terms, setTerms] = useState<{ title: string; key: string }[]>();// 联动数据中的学期数据   
  const [curTerm, setCurTerm] = useState<string>();// 学期默认值
  const [curGride, setCurGride] = useState<string>();// 年级数据

  useEffect(() => {
    if (dataSource) {
      const chainSel = dataSource.find((item) => item.type === 'chainSelect');// 找到类型为chainSelect的
      const grideSel = dataSource.find((item: any) => item.type === 'select');// 找到类型为select的
      const curXn = chainSel?.defaultValue?.first;// 学年默认值为第一个
      setchainData(chainSel?.data); // 改变联动数据
      if(curXn){
        setTerms(chainSel?.data?.subData[curXn])// 改变学期数据 --->联动数据下学年数据对应的学期数据
      }
      setCurrentXN(chainSel?.defaultValue?.first);// 学年数据默认值为第一个
      setCurTerm(chainSel?.defaultValue?.second);// 学期数据默认值为第二个
      setCurGride(grideSel?.defaultValue?.first);// 年级数据默认值为第一个
    }
  }, [dataSource])
 // 点击学年的事件
  const handleChainChange = (value: string) => {
    setCurrentXN(value);
    const ter = chainData?.subData[value] || []
    setTerms(ter);
    if (ter.length) {
      setCurTerm(ter[0].key)
    }
    onChange('year', value);
  };
   // 点击学期的事件
  const onTermChange = (value: any) => {
    setCurTerm(value);
    onChange('term', value);
  };
  // 点击年级的事件
  const onGrideChange = (value: any) => {
    setCurGride(value);
    onChange('gride', value);
  }
  // 点击搜索事件
  const onSearch = (value: any) => {
    onChange("customSearch", value)
  };
  return (
    <div className={styles.Header}>
      {dataSource?.map((item: any) => {
        const { label, type, placeHolder = '请输入', isLabel = true, data } = item;
        switch (type) {
          case 'chainSelect':
            return <div style={{ display: "inline-block" }}  >
              <div>
                <div className={styles.HeaderLable}>{label}</div>
                <div className={styles.HeaderSelect}>
                  <span className={styles.HeaderSelectOne}>
                    <Select onChange={handleChainChange} value={currentXN} style={{ width: 120 }} >
                      {chainData?.data?.map((year: any) => (
                        <Option value={year.key} key={year.key}>{year.title}</Option>
                      ))}
                    </Select>
                  </span>
                  <span className={styles.HeaderSelectTwo}>
                    <Select onChange={onTermChange} value={curTerm} style={{ width: 120 }}>
                      {terms?.map((term: any) => (
                        <Option value={term.key} key={term.key}>{term.title}</Option>
                      ))}
                    </Select>
                  </span>
                </div>
              </div>
            </div>
          case 'select':
            return <div style={{ display: "inline-block" }} >
              <div>
                <div className={styles.HeaderLable}>{label}</div>
                <div className={styles.HeaderSelect}>
                  <span className={styles.HeaderSelectTwo}>
                    <Select onChange={onGrideChange} value={curGride} style={{ width: '120px' }}>
                      {/* {data?.map((op: any) => <Option value={op.key} key={op.key}>{op.title}</Option>)} */}
                      {data?.map((op: any) => <Option value={op.id} key={op.id}>{op.NJMC}</Option>)}
                    </Select>
                  </span>
                </div>
              </div>
            </div>
          case 'input':
            return <div style={{ display: "inline-block" }} >
              <div className={styles.HeaderSearch} >
                {isLabel ? <span>{label}</span> : ''}
                <Search
                  placeholder={placeHolder}
                  onSearch={onSearch}
                  onPressEnter={(val) => { onChange("customSearch", (val.target as HTMLInputElement).value) }}
                  style={{ width: 200 }}
                />
              </div>
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