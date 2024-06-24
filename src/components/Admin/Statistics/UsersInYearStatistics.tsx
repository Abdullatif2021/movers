import { useEffect, useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetUsrsStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';
import { DatePicker } from 'antd';

const UsersInYearStatistics = () => {
  const { t } = useTranslation();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [usersStatisticsInYear, setUsersStatisticsInYear] = useState({
    chartPoints: [
      {
        month: 0,
        userCount: 0,
      },
    ],
  });

  const { data, refetch, isRefetching, error } = useQuery(['GetUsrsStatisticsIYear'], () =>
    GetUsrsStatistics(selectedYear)
      .then((response) => {
        if (response.data?.success) {
          setUsersStatisticsInYear(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const allMonths = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    monthName: new Date(0, index).toLocaleString('en', { month: 'long' }),
  }));

  const xValuesInYear = allMonths.map((month) => month.monthName);
  const yValuesInYear = allMonths.map((month) => {
    const chartPoint = usersStatisticsInYear.chartPoints.find((point) => point.month === month.month);
    return chartPoint ? { x: month.monthName, y: chartPoint.userCount } : { x: month.monthName, y: 0 };
  });

  const optionsInYear: any = {
    chart: {
      type: 'rangeArea',
    },
    xaxis: {
      categories: xValuesInYear || [],
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        distributed: true,
      },
    },
    colors: ['#b39dff'],
  };

  const seriesInYear = [
    {
      name: `${t('charts.numberOfUser')}`,
      data: yValuesInYear || [],
    },
  ];

  const handleYearChange = (newYear: any) => {
    const selectedYear = newYear?.year();
    setSelectedYear(selectedYear);
  };

  useEffect(() => {
    refetch();
  }, [selectedYear]);

  return (
    <Card padding="0 0 1.875rem" title={t('charts.UsersInYearStatistics')}>
      <div className="year-picker" style={{ margin: '1rem 40%' }}>
        <DatePicker picker="year" bordered onChange={handleYearChange} size="small" />
      </div>
      <div className="distributed-column-chart">
        <ReactApexChart key={1} options={optionsInYear} series={seriesInYear} height={350} />
      </div>
    </Card>
  );
};

export default UsersInYearStatistics;
