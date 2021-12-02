import PageContainer from '@/components/PageContainer';
import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { useModel, Link } from 'umi';
import { Select } from 'antd';
import { getCourses, statisClasses, statisCourses } from '@/services/after-class/reports';
import ProTable from '@ant-design/pro-table';
import Style from './index.less';
import type { TableItem } from './data';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { getTableWidth } from '@/utils/utils';
import amountImg from '@/assets/amount.png';
import personImg from '@/assets/person.png';
import classImg from '@/assets/class.png';
import courseImg from '@/assets/course.png';
import refundImg from '@/assets/refund.png';
import SearchLayout from '@/components/Search/Layout';
import SemesterSelect from '@/components/Search/SemesterSelect';
import CourseSelect from '@/components/Search/CourseSelect';
import { getSchoolCoursesTJ } from '@/services/after-class/khkcsj';

type selectType = { label: string; value: string };

const { Option } = Select;

const AfterSchoolCourse: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 选择学年学期
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 表格数据源
  const [dataSource, setDataSource] = useState<any>([]);
  const [collectData, setCollectData] = useState<any>();
  const [kcmc, setKcmc] = useState<any>();
  const [kcmcValue, setKcmcValue] = useState<any>();
  // 课程来源
  const [KCLY, setKCLY] = useState<string>();
  // 课程类型
  const [KCLXId, setKCLXId] = useState<string | undefined>();
  const [KCLXData, setKCLXData] = useState<selectType[] | undefined>();
  // table表格数据
  const columns: ProColumns<TableItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '课程来源',
      dataIndex: 'KCLY',
      key: 'KCLY',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      fixed: 'left',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '课程类型',
      dataIndex: 'KCLX',
      key: 'KCLX',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '所属机构/学校',
      dataIndex: 'JGMC',
      key: 'JGMC',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (_, record: any) => {
        return record?.KCLY === '校内课程' ? record?.XXMC : record?.JGMC;
      },
    },
    {
      title: '课程班数量',
      dataIndex: 'BJS',
      key: 'BJS',
      align: 'center',
      width: 130,
      ellipsis: true,
    },
    {
      title: '报名人次',
      dataIndex: 'BMRS',
      key: 'BMRS',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退课人次',
      dataIndex: 'TKRS',
      key: 'TKRS',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退课比例',
      dataIndex: 'TKBL',
      key: 'TKBL',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (test: any, record: any) => {
        const num =
          record.TKRS !== 0 ? `${(Number(record.TKRS / record.BMRS) * 100).toFixed(1)}%` : 0;
        return num;
      },
    },
    {
      title: '收款金额',
      dataIndex: 'SKJE',
      key: 'SKJE',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '退款金额',
      dataIndex: 'TKJE',
      key: 'TKJE',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 90,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Link
            to={{
              pathname: '/statistics/afterSchoolCourse/detail',
              state: {
                type: 'detail',
                data: record,
              },
            }}
          >
            详情
          </Link>
        </>
      ),
    },
  ];
  // 学年学期选相框触发的函数
  const getData = async () => {
    const kclxItem = KCLXData?.find((item: any) => item.value === KCLXId)?.label;
    const res3 = await getCourses({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
      KCLX: kclxItem,
      KCLY,
      KHKCSJId: kcmcValue,
    });
    if (res3.status === 'ok') {
      setDataSource(res3?.data?.rows);
    }
  };
  const getCollect = async () => {
    const kclxItem = KCLXData?.find((item: any) => item.value === KCLXId)?.label;
    const res = await getSchoolCoursesTJ({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
      KCLX: kclxItem,
      KCLY,
      KCMC: kcmc,
    });
    if (res.status === 'ok') {
      setCollectData(res?.data?.[0]);
    }
  };
  /**
   * 获取课程类型数据
   */
  const getKCLXData = async () => {
    const res = await getAllKHKCLX({});
    if (res.status === 'ok') {
      const KCLXItem: any = res.data?.map((item: any) => ({
        value: item.id,
        label: item.KCTAG,
      }));
      setKCLXData(KCLXItem);
    }
  };
  useEffect(() => {
    getKCLXData();
  }, []);
  // 学年学期变化
  useEffect(() => {
    if (curXNXQId) {
      getData();
      getCollect();
    }
  }, [curXNXQId, kcmcValue, kcmc, KCLXId, KCLY]);
  const submit = async () => {
    const res = await statisCourses({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
    });
    await statisClasses({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
    });
    if (res.status === 'ok') {
      getData();
      getCollect();
      message.success('刷新完成');
    }
  };
  return (
    // PageContainer组件是顶部的信息
    <PageContainer>
      <div style={{ marginBottom: 24 }}>
        <SearchLayout>
          <SemesterSelect
            XXJBSJId={currentUser?.xxId}
            onChange={(value: string) => {
              // 选择不同学期从新更新页面的数据
              setCurXNXQId(value);
            }}
          />
          <CourseSelect
            XXJBSJId={currentUser?.xxId}
            XNXQId={curXNXQId}
            onChange={(value, data) => {
              setKcmc(data?.children);
              setKcmcValue(value);
            }}
          />
          <div>
            <label htmlFor="school">课程类型：</label>
            <Select
              value={KCLXId}
              style={{ width: 160 }}
              placeholder="课程类型"
              allowClear
              onChange={(value: string) => {
                setKCLXId(value);
              }}
            >
              {KCLXData?.map((item: any) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div>
            <label htmlFor="kcly">课程来源：</label>
            <Select
              allowClear
              placeholder="课程来源"
              onChange={(value) => {
                setKCLY(value);
              }}
              value={KCLY}
            >
              <Option value="校内课程" key="校内课程">
                校内课程
              </Option>
              <Option value="机构课程" key="机构课程">
                机构课程
              </Option>
            </Select>
          </div>
        </SearchLayout>
      </div>
      <div className={Style.TopCards}>
        <div>
          <div>
            <span>
              <img src={courseImg} />
            </span>
            <div>
              <h3>{collectData?.kc_count || 0}</h3>
              <p>课程累计数</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <span>
              <img src={classImg} />
            </span>
            <div>
              <h3>{collectData?.bj_amount || 0}</h3>
              <p>课程班累计数</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <span>
              <img src={personImg} />
            </span>
            <div>
              <h3>{collectData?.bmrs_amount || 0}</h3>
              <p>报名累计人次</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <span>
              <img src={personImg} />
            </span>
            <div>
              <h3>{collectData?.tkrs_amount || 0}</h3>
              <p>退课累计人次</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <span>
              <img src={amountImg} />
            </span>
            <div>
              <h3>{collectData?.skje_amount || 0}</h3>
              <p>收款累计金额</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <span>
              <img src={refundImg} />
            </span>
            <div>
              <h3>{collectData?.tkje_amount || 0}</h3>
              <p>退款累计金额</p>
            </div>
          </div>
        </div>
      </div>
      <div className={Style.AfterSchoolCourse}>
        <p className={Style.title}>
          <span>系统每天凌晨自动更新一次，如需立即更新，请点击【刷新】按钮</span>
          <Button type="primary" onClick={submit}>
            刷新
          </Button>
        </p>
        <ProTable
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          search={false}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            defaultCurrent: 1,
          }}
          scroll={{ x: getTableWidth(columns) }}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </div>
      {/* <Link to={{ pathname: '/afterSchoolCourse/detail',}}>详情</Link> */}
    </PageContainer>
  );
};
export default AfterSchoolCourse;
