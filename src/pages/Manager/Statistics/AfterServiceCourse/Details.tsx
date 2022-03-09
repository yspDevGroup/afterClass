import PageContain from '@/components/PageContainer';

const Details = (props: any) => {
  const { state } = props.location;
  console.log(state,'state------')
  return <>
    <PageContain>
      1111
    </PageContain>
  </>
}

export default Details;
