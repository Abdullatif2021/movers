import { useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetUsrsStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';

const UsersStatistics = () => {
  const { t } = useTranslation();

  const [usersStatistics, setUsersStatistics] = useState({
    users: 0,
    activeUsers: 0,
    deActiveUsers: 0,
    admins: 0,
    companyBranchUser: 0,
    companyUser: 0,
    customerService: 0,
    mediatorUser: 0,
    totalCount: 0,
  });

  const { data, refetch, isRefetching, error } = useQuery(['GetUsrsStatistics'], () =>
    GetUsrsStatistics()
      .then((response) => {
        if (response.data?.success) {
          setUsersStatistics(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const xValues = Object.keys(usersStatistics);
  const yValues = Object.values(usersStatistics);

  const dataPoints = xValues.map((label, index) => ({ label, value: yValues[index] }));

  dataPoints.sort((a, b) => a.value - b.value);

  const sortedXValues = dataPoints.map((dataPoint) => dataPoint.label);
  const sortedYValues = dataPoints.map((dataPoint) => dataPoint.value);

  const options: any = {
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      categories: sortedXValues.map((label) => t(`charts.${label}`)),
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        distributed: true,
        barHeight: '80%',
        isFunnel: true,
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'middle',
      formatter: function (value: any, { dataPointIndex }: any) {
        return `${t(`charts.${sortedXValues[dataPointIndex]}`)}: ${value}`;
      },
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: `${t('charts.count')}`,
      data: sortedYValues,
    },
  ];

  return (
    <Card padding="0 0 1.875rem" title={t('charts.UsersStatistics')}>
      <div className="distributed-column-chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default UsersStatistics;
