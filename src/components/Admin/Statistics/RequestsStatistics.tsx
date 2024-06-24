import { useEffect, useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetRequestsStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const RequestsInTimeLineStatistics = () => {
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [requestsStatistics, setRequestsStatistics] = useState({
    totalNumber: 0,
    checking: 0,
    approved: 0,
    rejected: 0,
    possible: 0,
    hasOffers: 0,
    inProcess: 0,
  });

  const { data, refetch, isRefetching, error } = useQuery(['GetRequestsStatistics'], () =>
    GetRequestsStatistics(dateRange[0], dateRange[1])
      .then((response) => {
        if (response.data?.success) {
          setRequestsStatistics(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const xValues = Object.keys(requestsStatistics);
  const yValues = Object.values(requestsStatistics);

  const translatedXValues = xValues.map((label) => t(`charts.${label}`));

  const dataPoints = translatedXValues.map((label, index) => ({ label, value: yValues[index] }));

  dataPoints.sort((a, b) => a.value - b.value);

  const sortedXValues = dataPoints.map((dataPoint) => dataPoint.label);
  const sortedYValues = dataPoints.map((dataPoint) => dataPoint.value);

  const options = {
    chart: {
      height: 380,
    },
    plotOptions: {
      bar: {
        barHeight: '100%',
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom',
        },
      },
    },
    colors: [
      '#33b2df',
      '#546E7A',
      '#d4526e',
      '#13d8aa',
      '#A5978B',
      '#2b908f',
      '#f9a3a4',
      '#90ee7e',
      '#f48024',
      '#69d2e7',
    ],
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    xaxis: {
      categories: sortedXValues || [],
    },
  };

  const series = [
    {
      name: `${t('charts.numberOfRequests')}`,
      data: sortedYValues || [],
    },
  ];

  useEffect(() => {
    refetch();
  }, [dateRange]);

  return (
    <Card padding="0 0 1.875rem" title={t('charts.RequestsInTimeLineStatistics')}>
      <div style={{ margin: '1rem 30%' }}>
        <RangePicker
          onChange={(dates, dateStrings) => {
            setDateRange(dateStrings);
          }}
          size="small"
        />
      </div>
      <div className="distributed-column-chart">
        <ReactApexChart key={2} options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default RequestsInTimeLineStatistics;
