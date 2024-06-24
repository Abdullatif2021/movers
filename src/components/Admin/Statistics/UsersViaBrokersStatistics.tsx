import { useEffect, useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetUsersViaBrokersStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@app/hooks/useLanguage';

const UsersViaBrokersStatistics = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [usersViaBrokersStatistics, setUsersViaBrokersStatistics] = useState<any[]>([]);

  const { data, refetch, isRefetching, error } = useQuery(['GetUsersViaBrokersStatistics'], () =>
    GetUsersViaBrokersStatistics()
      .then((response) => {
        if (response.data?.success) {
          setUsersViaBrokersStatistics(response?.data?.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const xValues = usersViaBrokersStatistics?.map(
    (usersViaBrokerStatistics: any) =>
      usersViaBrokerStatistics.broker.firstName + ' ' + usersViaBrokerStatistics.broker.lastName,
  );
  const codeValues = usersViaBrokersStatistics?.map((usersViaBrokerStatistics: any) => usersViaBrokerStatistics.code);
  const yValues = usersViaBrokersStatistics?.map((usersViaBrokerStatistics: any) => ({
    x: usersViaBrokerStatistics.broker.firstName + ' ' + usersViaBrokerStatistics.broker.lastName,
    y: usersViaBrokerStatistics.userCount,
  }));

  const options: any = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: xValues || [],
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        distributed: true,
        columnWidth:
          usersViaBrokersStatistics.length < 5 ? '20%' : usersViaBrokersStatistics.length < 10 ? '20%' : '50%',
      },
    },
    colors: ['#546E7A', '#A5978B', '#f9a3a4', '#d4526e'],
  };

  const series = [
    {
      name: `${codeValues} / ${t('charts.count')}`,
      data: yValues || [],
    },
  ];

  return (
    <Card padding="0 0 1.875rem" title={t('charts.UsersViaBrokersStatistics')}>
      <div className="distributed-column-chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default UsersViaBrokersStatistics;
