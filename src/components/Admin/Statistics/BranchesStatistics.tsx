import { useEffect, useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { GetBranchesStatistics } from '@app/services/statistics';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { Card } from '@app/components/common/Card/Card';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@app/hooks/useLanguage';

const BranchesStatistics = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [branchesStatistics, setBranchesStatistics] = useState<any[]>([]);

  const { data, refetch, isRefetching, error } = useQuery(['GetBranchesStatistics'], () =>
    GetBranchesStatistics()
      .then((response) => {
        if (response.data?.success) {
          setBranchesStatistics(response.data.result);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      })
      .catch((err) => {
        notificationController.error({ message: err?.message || 'An error occurred' });
        throw err;
      }),
  );

  const xValues = branchesStatistics?.map((branchStatistics: any) => branchStatistics.companyBranch.name);
  const yValues = branchesStatistics?.map((branchStatistics: any) => ({
    x: branchStatistics.companyBranch.name,
    y: branchStatistics.requestForQuotationCount,
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
        columnWidth: branchesStatistics.length < 5 ? '20%' : branchesStatistics.length < 10 ? '20%' : '50%',
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
    <Card padding="0 0 1.875rem" title={t('charts.BranchesStatistics')}>
      <div className="distributed-column-chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </Card>
  );
};

export default BranchesStatistics;
