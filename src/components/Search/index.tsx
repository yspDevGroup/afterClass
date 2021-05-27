/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-24 16:33:45
 * @LastEditTime: 2021-05-25 17:39:03
 * @LastEditors: txx
 */

import type { FC } from 'react';
import { useState } from 'react';
import { Input, Select, } from 'antd';
import styles from "./index.less";
import { dataSource } from './mock';

type ISearchComponent = {
  /** 输入框默认值 */
  placeholder?: string,
  /** 点击搜索图标、清除图标，或按下回车键时的回调 */
  onSearch?: (value: any, event: any) => void
  /** 左侧筛选的字段 */
  fieldOne?: string;
  /** 左侧筛选的字段 */
  fieldTwo?: string;
  /** 表头第一个字段选择 */
  one?: string;
  /** 表头第二个字段选择 */
  two?: string;
  /** 表头第三个字段选择 */
  three?: string;
  /** 判断表头是否只有search */
  onlySearch?: boolean;
  /** 判断表头有几个字段选择  默认是1个 */
  HeaderFieldTitleNum?: boolean;
  /** 第一个下拉数据 */
  downOneData?: {
    oneData?: string;
  }[];
  /** 第二个下拉数据 */
  downTwoData?: {
    twoData?: string;
  }[];
  /** 第三个下拉数据 */
  downThreeData?: {
    threeData?: string;
  }[];

}

const { Search } = Input;
const { Option } = Select;
const onSearch = (value: any) => console.log(value);

const SearchComponent: FC<ISearchComponent> = () => {
  const { itemRecourse, chainData } = dataSource;
  const [terms, setTerms] = useState<any>(chainData.subData[chainData.data[0].key]);
  const [curTerm, setCurTerm] = useState<string>(chainData.subData[chainData.data[0].key][0].key);
  

  const handleChainChange = (value: any) => {
    const curData = chainData.subData;
    setTerms(curData[value]);
    setCurTerm(curData[value][0].key);
  };
  const onTermChange = (value: any)=>{
    setCurTerm(value);
  };
  return (
    <div className={styles.SearchBox}>
      {itemRecourse.map((item) => {
        const { label, type, placeHolder = '请输入', isLabel = true, data } = item;
        switch (type) {
          case 'input':
            return <>
              {isLabel ? <span>{label}</span> : ''}
              <Search
                placeholder={placeHolder}
                onSearch={onSearch}
                style={{ width: 200 }}
                bordered={false}
              /></>;
            break;
          case 'select':
            return <>
              <div className={styles.HeaderFieldTitle}>{label}</div>
              <div className={styles.HeaderFieldYear}>
                <Select defaultValue={data![0].title} style={{ width: 120 }}>
                  {data?.map((op: any) => <Option value={op.key}>{op.title}</Option>)}
                </Select>
              </div>
            </>
          case 'chainSelect':
            return <>
              <div className={styles.HeaderFieldTitle}>{label}</div>
              <div className={styles.HeaderFieldYear}>
                <Select style={{ width: 120 }} onChange={handleChainChange} defaultValue={chainData.data[0].key} >
                  {chainData.data?.map(year => (
                    <Option value={year.key}>{year.title}</Option>
                  ))}
                </Select>
                <Select style={{ width: 120 }} onChange={onTermChange} value={curTerm} >
                  {terms?.map((term: any) => (
                    <Option value={term.key}>{term.title}</Option>
                  ))}
                </Select>
              </div>
            </>
          default:
            return <></>
        }
      })}
    </div >
  )
}
export default SearchComponent