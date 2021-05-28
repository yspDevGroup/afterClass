/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-24 16:33:45
 * @LastEditTime: 2021-05-28 15:02:49
 * @LastEditors: txx
 */

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Input, Select, } from 'antd';
import styles from "./index.less";
import type { SearchDataType } from './data';

type ISearchComponent = {
  dataSource?: SearchDataType;
  onChange?: any;
}
type ChainDataType = {
  data: { title: string, key: string }[],
  subData: Record<string, { title: string; key: string }[]>
}

const { Search } = Input;
const { Option } = Select;
const onSearch = (value: any) => console.log(value);

const SearchComponent: FC<ISearchComponent> = ({ dataSource, onChange }) => {
  const [chainData, setchainData] = useState<ChainDataType>();
  const [currentXN, setCurrentXN] = useState<string>();
  const [terms, setTerms] = useState<{ title: string; key: string }[]>();
  const [curTerm, setCurTerm] = useState<string>();
  const [curGride, setCurGride] = useState<string>();

  useEffect(() => {
    if (dataSource) {
      const chainSel = dataSource.find((item) => item.type === 'chainSelect');
      const grideSel = dataSource.find((item: any) => item.label === '年级：');
      const curXn = chainSel?.defaultValue?.first;
      setchainData(chainSel?.data);
      if(curXn){
        setTerms(chainSel?.data?.subData[curXn])
      }
      setCurrentXN(chainSel?.defaultValue?.first);
      setCurTerm(chainSel?.defaultValue?.second);
      setCurGride(grideSel?.defaultValue?.first);
    }
  }, [dataSource])

  const handleChainChange = (value: string) => {
    setCurrentXN(value);
    const ter = chainData?.subData[value] || []
    setTerms(ter);
    if (ter.length) {
      setCurTerm(ter[0].key)
    }
    onChange('year', value);
  };
  const onTermChange = (value: any) => {
    setCurTerm(value);
    onChange('term', value);
  };
  const onGrideChange = (value: any) => {
    setCurGride(value);
    onChange('gride', value);
  }
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
          case 'select': {
            return <div style={{ display: "inline-block" }} >
              <div>
                <div className={styles.HeaderLable}>{label}</div>
                <div className={styles.HeaderSelect}>
                  <span className={styles.HeaderSelectTwo}>
                    <Select onChange={onGrideChange} value={curGride} style={{ width: '120px' }}>
                      {data?.map((op: any) => <Option value={op.id} key={op.id}>{op.NJMC}</Option>)}
                    </Select>
                  </span>
                </div>
              </div>
            </div>
          }
          case 'input':
            return <div style={{ display: "inline-block" }} >
              <div className={styles.HeaderSearch} >
                {isLabel ? <span>{label}</span> : ''}
                <Search
                  placeholder={placeHolder}
                  onSearch={onSearch}
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