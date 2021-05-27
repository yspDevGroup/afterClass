/*
 * @description: 
 * @author: txx
 * @Date: 2021-05-26 11:44:01
 * @LastEditTime: 2021-05-27 08:31:25
 * @LastEditors: txx
 */
import { useState } from 'react';
import type { FC } from 'react';
import { Select, Input, List } from 'antd';
import styles from "./index.less"

type Ipoprs = {
  /** 搜索文字 */
  placeholder?: string;
  /** 数据 */
  fieldData?: {
    Field?: string | undefined;
    oneData1?: string | undefined;
    oneData2?: string | undefined;
    filedTwoDataOne?: string | undefined;
   

  }[] | undefined;
  /** 判断表头是否只有search */
  onlySearch?: boolean;
  /** 判断第二个字段选择是否存在 */
  filedSelectTwo?: boolean;
  cityData: Record<string, any>,
  provinceData: any[]
}

// const { Option } = Select;
const { Search } = Input;


// function handleChange(value: any) {
//   console.log(`selected ${value}`);
// }

const onSearch = (value: any) => console.log(value);


const { Option } = Select;

const SelectComponent: FC<Ipoprs> = ({
  placeholder,
  fieldData,
  onlySearch,
  filedSelectTwo,
  cityData,
  provinceData
}) => {
  console.log('cityData',cityData);
  console.log('provinceData',provinceData);
  
  const [cities, setCities] = useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);

  const handleProvinceChange = (value: string | number) => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };

  const onSecondCityChange = (value: any) => {
    setSecondCity(value);
  };
  return (

    <div className={styles.HeaderFieldBox}>

      {onlySearch === true ?
        (<div className={styles.HeaderBox}>
          <div className={styles.HeaderSearch}>
            <div className={styles.SearchBox}>
              <Search
                placeholder={placeholder}
                onSearch={onSearch}
                style={{ width: 200 }}
                allowClear
              />
            </div>
          </div>
        </div>)
        :
        (<div className={styles.HeaderBox}>
          <div className={styles.FieldBox}>
            <List
              dataSource={fieldData}
              renderItem={(item: any) => {
                return (
                  <div>
                    <div className={styles.HeaderField} >
                      <span>{item.Field}</span>
                      {/* <Select defaultValue={item.oneData1} style={{ width: 120 }} onChange={handleChange}>
                        <Option value={item.oneData1}>{item.oneData1}</Option>
                        <Option value={item.oneData2}>{item.oneData2}</Option>
                      </Select> */}
                      <Select style={{ width: 120 }} onChange={handleProvinceChange}>
                        {provinceData.map(province => (
                          <Option key={province} value={province}>{province}</Option>
                        ))}
                      </Select>
                      {filedSelectTwo === true ?
                        (
                          // <Select defaultValue={item.twoData1} style={{ width: 120, marginLeft: "8px" }} onChange={handleChange}>
                          //   <Option value={item.twoData1}>{item.twoData1}</Option>
                          //   <Option value={item.twoData2}>{item.twoData2}</Option>
                          // </Select>
                          <Select style={{ width: 120, marginLeft: "8px" }} value={secondCity} onChange={onSecondCityChange}>
                            {cities.map((city: any) => (
                              <Option key={city} value={city}>{city}</Option>
                            ))}
                          </Select>
                        )
                        :
                        ""
                      }

                    </div>
                  </div>
                );
              }}
            />
          </div>

          <div className={styles.HeaderSearch}>
            <div className={styles.SearchBox}>
              <Search
                placeholder={placeholder}
                onSearch={onSearch}
                style={{ width: 200 }}
                allowClear
              />
            </div>
          </div>

        </div>)
      }


    </div >
  )
}
export default SelectComponent