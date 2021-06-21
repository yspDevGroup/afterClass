/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-24 16:33:45
 * @LastEditTime: 2021-06-02 08:49:21
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

const { Search } = Input;
const { Option } = Select;

const SearchComponent: FC<ISearchComponent> = ({ dataSource, onChange }) => {
  const [chainData, setchainData] = useState<ChainDataType>();// 联动数据
  const [currentXN, setCurrentXN] = useState<string>();// 学年默认值
  const [terms, setTerms] = useState<{ label: string; value: string }[]>();// 联动数据中的学期数据   
  const [curTerm, setCurTerm] = useState<string>();// 学期默认值
  const [curGride, setCurGride] = useState<string>();// 年级数据

  useEffect(() => {
    if (dataSource) {
      const chainSel = dataSource.find((item) => item.type === 'chainSelect');// 找到类型为chainSelect的
      const singleSel = dataSource.find((item: any) => item.type === 'select');// 找到类型为select的
      const curXn = chainSel?.defaultValue?.first;// 学年默认值为第一个
      setchainData(chainSel?.data); // 改变联动数据
      if (curXn) {
        setTerms(chainSel?.data?.subData[curXn])// 改变学期数据 --->联动数据下学年数据对应的学期数据
      }
      setCurrentXN(chainSel?.defaultValue?.first);// 学年数据默认值为第一个
      setCurTerm(chainSel?.defaultValue?.second);// 学期数据默认值为第二个
      setCurGride(singleSel?.defaultValue?.first);// select数据默认值为第一个
    }
  }, [dataSource])
  // 点击学年的事件
  const handleChainChange = (value: string) => {
    setCurrentXN(value);
    const ter = chainData?.subData[value] || []
    setTerms(ter);
    if (ter.length) {
      setCurTerm(ter[0].value)
    }
    onChange('year', value, ter[0].value);
  };
  // 点击学期的事件
  const onTermChange = (value: any) => {
    setCurTerm(value);
    onChange('term', currentXN, value);
  };
  // 点击select的事件
  const onGrideChange = (value: any) => {
    setCurGride(value);
    onChange('select', value);
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
            return <div style={{ display: "inline-block" }} key={`chainSelect${label}`}  >
              <div>
                <div className={styles.HeaderLable}>{label}</div>
                <div className={styles.HeaderSelect}>
                  <span className={styles.HeaderSelectOne}>
                    <Select onChange={handleChainChange} value={currentXN} style={{ width: 120 }} >
                      {chainData?.data && chainData?.data.length && chainData?.data.map((year: any) => (
                        <Option value={year.value} key={year.value}>{year.label}</Option>
                      ))}
                    </Select>
                  </span>
                  <span className={styles.HeaderSelectTwo}>
                    <Select onChange={onTermChange} value={curTerm} style={{ width: 120 }}>
                      {terms && terms.length && terms.map((term: any) => (
                        <Option value={term.value} key={term.value}>{term.label}</Option>
                      ))}
                    </Select>
                  </span>
                </div>
              </div>
            </div>
          case 'select':
            return <div style={{ display: "inline-block" }}  key={`select${label}`} >
              <div>
                <div className={styles.HeaderLable}>{label}</div>
                <div className={styles.HeaderSelect}>
                  <span className={styles.HeaderSelectTwo}>
                    <Select onChange={onGrideChange} value={curGride} style={{ width: '120px' }}>
                      {data && data.length && data.map((op: any) => <Option value={op.key} key={op.key}>{op.label}</Option>)}
                    </Select>
                  </span>
                </div>
              </div>
            </div>
          case 'input':
            return <div style={{ display: "inline-block" }}  key={`input${label}`}>
              <div className={styles.HeaderSearch} >
                {isLabel ? <span>{label}</span> : ''}
                <Search
                  placeholder={placeHolder}
                  onSearch={onSearch}
                  onPressEnter={(val) => { onChange("customSearch", (val.target as unknown as HTMLInputElement).value) }}
                  style={{ width: 200 }}
                />
              </div>
            </div>;
            break;
          case 'text':
            return <div style={{ display: "inline-block" }} >
              <div className={styles.HeaderSearch} >
                {isLabel ? <span>{label}</span> : ''}
                <span>{data[0]}</span>
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