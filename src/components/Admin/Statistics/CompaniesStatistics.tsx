import { useEffect, useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetCompaniesStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@app/hooks/useLanguage';

const CompaniesStatistics = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [companiesStatistics, setCompaniesStatistics] = useState<any[]>([]);

  const { data, refetch, isRefetching, error } = useQuery(['GetCompaniesStatistics'], () =>
    GetCompaniesStatistics()
      .then((response) => {
        if (response.data?.success) {
          setCompaniesStatistics(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const xValues = companiesStatistics?.map((companyStatistics: any) => companyStatistics.company.name);
  const yValues = companiesStatistics?.map((companyStatistics: any) => ({
    x: companyStatistics.company.name,
    y: companyStatistics.requestForQuotationCount,
  }));

  const options: any = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: xValues || [],
      labels: {
        style: {
          // whiteSpace: 'normal',
        },
        rotate: language == 'ar' ? 45 : '',
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        distributed: true,
        columnWidth: companiesStatistics.length < 5 ? '20%' : companiesStatistics.length < 10 ? '20%' : '50%',
      },
    },
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
    <Card padding="0 0 1.875rem" title={t('charts.CompaniesStatistics')}>
      <div className="distributed-column-chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default CompaniesStatistics;
