// import joinSchool from '@/assets/icons/join-schools.png'
import openOrganization from '@/assets/icons/open-organization.png';
import courseSum from '@/assets/icons/course-sum.png';
import joinStudent from '@/assets/icons/join-student.png';
import joinTeacher from '@/assets/icons/join-teacher.png';
import totalSum from '@/assets/icons/total-sum.png';
import refundSum from '@/assets/icons/refund-sum.png';
import organizationCourse from '@/assets/icons/organization-course.png';
import schoolCourse from '@/assets/icons/school-course.png';

export const topNum = [
  {
    title: '合作机构',
    type: 'jg_count',
    bgImg: openOrganization,
  },
  {
    title: '课程总数',
    type: 'kc_count',
    bgImg: courseSum,
  },
  {
    title: '课程班总数',
    type: 'bj_count',
    bgImg: courseSum,
  },
  {
    title: '学校课程',
    type: 'xxkc_count',
    bgImg: schoolCourse,
  },
  {
    title: '机构课程',
    type: 'jgkc_count',
    bgImg: organizationCourse,
  },
  {
    title: '参与学生数',
    type: 'xs_counts',
    bgImg: joinStudent,
  },
  {
    title: '参与教师数',
    type: 'js_count',
    bgImg: joinTeacher,
  },
  {
    title: '收费总额(元)',
    type: 'bjdd_amount',
    bgImg: totalSum,
  },
  {
    title: '退费总额(元)',
    type: 'tk_amounts',
    bgImg: refundSum,
  },
];
