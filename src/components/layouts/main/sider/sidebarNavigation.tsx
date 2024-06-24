import React from 'react';
import {
  LineChartOutlined,
  UserOutlined,
  PhoneOutlined,
  BarChartOutlined,
  NotificationOutlined,
  FormOutlined,
  UnlockOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  HomeOutlined,
  QuestionOutlined,
  FormatPainterOutlined,
  SoundOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  FileUnknownOutlined,
  DollarOutlined,
  StopOutlined,
  SettingOutlined,
  AppstoreOutlined,
  StarOutlined,
  CloudUploadOutlined,
  WalletOutlined,
  SafetyOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
  permissions: string[];
}

type SidebarData = {
  [key: string]: SidebarNavigationItem[];
};

const AdminSidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'sidebarNavigation.Statistics',
    key: 'statistics',
    url: '/',
    icon: <LineChartOutlined />,
    permissions: [],
  },
  {
    title: 'sidebarNavigation.Users',
    key: 'userManagement',
    url: '/user-management',
    icon: <UserOutlined />,
    permissions: ['Pages.Users'],
  },
  {
    title: 'sidebarNavigation.Managers',
    key: 'managerManagement',
    url: '/manager-management',
    icon: <UserOutlined />,
    permissions: ['Pages.Users'],
  },
  {
    title: 'sidebarNavigation.Roles',
    key: 'roles',
    url: `/roles`,
    icon: <UnlockOutlined />,
    permissions: ['Pages.Roles'],
  },
  {
    title: 'sidebarNavigation.Requests',
    key: 'Requests',
    url: '/requests',
    icon: <AuditOutlined />,
    permissions: ['Request.List'],
  },
  {
    title: 'sidebarNavigation.Companies',
    key: 'Companies',
    url: '/companies',
    icon: <BankOutlined />,
    permissions: ['Company.List'],
  },
  {
    title: 'sidebarNavigation.branchesWithoutCompany',
    key: 'branchesWithoutCompany',
    url: '/branchesWithoutCompany',
    icon: <ApartmentOutlined />,
    permissions: ['CompanyBranch.List'],
  },
  {
    title: 'sidebarNavigation.Payments',
    key: 'Payments',
    url: '/Payments',
    icon: <WalletOutlined />,
    permissions: [],
  },
  {
    title: 'sidebarNavigation.CommissionGroups',
    key: 'commissionGroups',
    url: '/commissionGroups',
    icon: <AppstoreOutlined />,
    permissions: ['CommissionGroup.FullControl'],
  },
  {
    title: 'sidebarNavigation.Points',
    key: 'Points',
    url: '/Points',
    icon: <DollarOutlined style={{ marginBottom: '-7px' }} />,
    permissions: ['Points.FullControl'],
  },
  {
    title: 'sidebarNavigation.FeaturedBundles',
    key: 'FeaturedBundles',
    url: '/FeaturedBundles',
    icon: <StarOutlined />,
    permissions: ['Points.FullControl'],
  },
  {
    title: 'sidebarNavigation.AskForHelp',
    key: 'AskForHelp',
    url: `/AskForHelp`,
    icon: <FileUnknownOutlined />,
    permissions: ['Request.List'],
  },
  {
    title: 'sidebarNavigation.Services',
    key: 'services',
    url: `/services`,
    icon: <FormatPainterOutlined />,
    permissions: ['Service.FullControl'],
  },
  {
    title: 'sidebarNavigation.SourceType',
    key: 'sourceType',
    url: `/sourceType`,
    icon: <HomeOutlined />,
    permissions: ['SourceType.FullControl'],
  },
  {
    title: 'sidebarNavigation.Locations',
    key: 'locations',
    url: `/locations/countries`,
    icon: <EnvironmentOutlined />,
    permissions: ['Country.FullControl'],
  },
  {
    title: 'sidebarNavigation.Partners',
    key: 'Partners',
    url: `/Partners`,
    icon: <TeamOutlined />,
    permissions: ['Partner.FullControl'],
  },
  {
    title: 'sidebarNavigation.Brokers',
    key: 'Brokers',
    url: `/Brokers`,
    icon: <TeamOutlined />,
    permissions: ['Broker.FullControl'],
  },
  {
    title: 'sidebarNavigation.RejectReason',
    key: 'RejectReason',
    url: `/RejectReason`,
    icon: <StopOutlined />,
    permissions: ['RejectReason.FullControl'],
  },
  {
    title: 'sidebarNavigation.ContactUs',
    key: 'contactUs',
    url: `/contactUs`,
    icon: <PhoneOutlined />,
    permissions: ['ContactUs.FullControl'],
  },
  {
    title: 'sidebarNavigation.Notifications',
    key: 'Notifications',
    url: `/Notifications`,
    icon: <SoundOutlined />,
    permissions: [],
  },
  {
    title: 'sidebarNavigation.PrivacyPolicy',
    key: 'PrivacyPolicy',
    url: `/PrivacyPolicy`,
    icon: <SafetyCertificateOutlined />,
    permissions: ['PrivacyPolicy.FullControl'],
  },
  {
    title: 'sidebarNavigation.PaymentPrivacy',
    key: 'PaymentPrivacy',
    url: `/PaymentPrivacy`,
    icon: <SafetyOutlined />,
    permissions: ['PrivacyPolicy.FullControl'],
  },
  {
    title: 'sidebarNavigation.Terms',
    key: 'Term',
    url: `/Terms`,
    icon: <FileProtectOutlined />,
    permissions: ['Terms.FullControl'],
  },
  {
    title: 'sidebarNavigation.FrequentlyQuestions',
    key: 'FrequentlyQuestions',
    url: `/FrequentlyQuestions`,
    icon: <QuestionOutlined />,
    permissions: ['FrequencyQuestion.FullControl'],
  },
  {
    title: 'sidebarNavigation.ApplicationsVersions',
    key: 'ApplicationsVersions',
    url: `/ApplicationsVersions`,
    icon: <CloudUploadOutlined />,
    permissions: ['ApkBuild.FullControl'],
  },
  {
    title: 'sidebarNavigation.Configurations',
    key: 'Configurations',
    url: `/Configurations`,
    icon: <SettingOutlined />,
    permissions: [
      'GetCommissionForBranchesWithoutCompany',
      'GetDiscountPercentage',
      'GetEmailSetting',
      'GetFileSizeSetting',
      'GetHoursInSystem',
      'GetSmsSetting',
    ],
  },
];

export const sidebarData: SidebarData = {
  admin: AdminSidebarNavigation,
  manager: AdminSidebarNavigation,
};
