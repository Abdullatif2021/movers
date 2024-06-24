import React, { useState, useEffect } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetCitiesStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@app/hooks/useLanguage';

const CitiesStatistics = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [citiesStatistics, setCitiesStatistics] = useState<any[]>([]);

  const { data, refetch, isRefetching, error } = useQuery(['GetCitiesStatistics'], () =>
    GetCitiesStatistics()
      .then((response) => {
        if (response.data?.success) {
          setCitiesStatistics(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const xValues = citiesStatistics?.map((cityStatistics: any) => cityStatistics.cityDto.name);
  const yValues = citiesStatistics?.map((cityStatistics: any) => ({
    x: cityStatistics.cityDto.name,
    y: cityStatistics.requestForQuotationCount,
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
        columnWidth: citiesStatistics.length < 10 ? '40%' : '50%',
      },
    },
    colors: ['#00CED1', '#20B2AA', '#40E0D0', '#00FFFF'],
  };

  const series = [
    {
      name: `${t('charts.requestsCount')}`,
      data: yValues || [],
    },
  ];

  useEffect(() => {
    refetch();
  }, [language]);

  return (
    <Card padding="0 0 1.875rem" title={t('charts.CitiesStatistics')}>
      <div className="distributed-column-chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default CitiesStatistics;
