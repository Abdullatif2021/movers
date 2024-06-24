import { useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';
import { GetStatisticsNumbers } from '@app/services/statistics';

const GeneralStatistics = () => {
  const { t } = useTranslation();

  const [statisticsData, setStatisticsData] = useState({
    companiesCount: 0,
    companyBranchCount: 0,
    brokersCount: 0,
    partnersCount: 0,
  });

  const { data, refetch, isRefetching, error } = useQuery(['GetStatisticsNumbers'], () =>
    GetStatisticsNumbers()
      .then((response) => {
        if (response.data?.success) {
          setStatisticsData(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const xValues = Object.keys(statisticsData);
  const yValues = Object.values(statisticsData);

  // Create an array of objects with labels and values
  const dataPoints = xValues.map((label, index) => ({ label, value: yValues[index] }));

  // Sort the dataPoints in ascending order by value
  dataPoints.sort((a, b) => a.value - b.value);

  // Extract the sorted xValues and yValues
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
      name: `${t('charts.Statistics')}`,
      data: sortedYValues,
    },
  ];

  return (
    <Card padding="0 0 1.875rem" title={t('charts.StatisticsNumbers')}>
      <div className="distributed-bar-chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default GeneralStatistics;
