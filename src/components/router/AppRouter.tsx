import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import LoginPage from '@app/pages/AuthPages/LoginPage';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import { PrivateRoute } from '@app/hocs/withAuthorization';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { UserRole } from '@app/constants/userRole';

const AuthLayout = lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
const ServerErrorPage = lazy(() => import('@app/pages/ErrorsPages/ServerErrorPage'));
const Error404Page = lazy(() => import('@app/pages/ErrorsPages/Error404Page'));
const Logout = lazy(() => import('./Logout'));
const StatisticsAdmin = lazy(() => import('@app/pages/StatsticsPages/StatisticsPage'));
const UserPage = lazy(() => import('@app/pages/UsersPages/UsersPage'));
const ManagerPage = lazy(() => import('@app/pages/UsersPages/ManagersPage'));
const ServicePage = lazy(() => import('@app/pages/ServicesPages/ServicesPage'));
const SubServicePage = lazy(() => import('@app/pages/ServicesPages/SubServicesPage'));
const ToolPage = lazy(() => import('@app/pages/ServicesPages/ToolsPage'));
const SourceTypePage = lazy(() => import('@app/pages/SourceTypesPages/SourceTypesPage'));
const TypeForSourcePage = lazy(() => import('@app/pages/SourceTypesPages/TypesForSourcePage'));
const ParentAttributeChoicePage = lazy(() => import('@app/pages/SourceTypesPages/ParentAttributeChoicesPage'));
const ChildAttributeChoicePage = lazy(() => import('@app/pages/SourceTypesPages/ChildAttributeChoicesPage'));
const CountryPage = lazy(() => import('@app/pages/LocationsPages/CountriesPage'));
const CityPage = lazy(() => import('@app/pages/LocationsPages/CitiesPage'));
const RegionPage = lazy(() => import('@app/pages/LocationsPages/RegionPage'));
const Notifications = lazy(() => import('@app/pages/OtherPages/NotificationsPage'));
const Terms = lazy(() => import('@app/pages/OtherPages/TermPage'));
const ContactusPage = lazy(() => import('@app/pages/OtherPages/ContactUsPage'));
const PrivacyPolicy = lazy(() => import('@app/pages/OtherPages/PrivacyPolicyPage'));
const PaymentPrivacy = lazy(() => import('@app/pages/OtherPages/PaymentPrivacyPage'));
const RolePage = lazy(() => import('@app/pages/OtherPages/RolesPage'));
const RequestPage = lazy(() => import('@app/pages/RequestsPages/RequestsPage'));
const HisRequestPage = lazy(() => import('@app/pages/UsersPages/HisRequests'));
const RequestDetailPage = lazy(() => import('@app/pages/RequestsPages/RequestDetailsPage'));
const SuitableCompanyPage = lazy(() => import('@app/pages/RequestsPages/SuitableCompaniesPage'));
const OfferPage = lazy(() => import('@app/pages/RequestsPages/OffersPage'));
const OfferDetailsPage = lazy(() => import('@app/pages/RequestsPages/OfferDetailsPage'));
const AddRequestPage = lazy(() => import('@app/pages/RequestsPages/AddRequestPage'));
const EditRequestPage = lazy(() => import('@app/pages/RequestsPages/EditRequestPage'));
const CompleteDraftPage = lazy(() => import('@app/pages/RequestsPages/CompleteDraftsPage'));
const DraftPage = lazy(() => import('@app/pages/Drafts/DraftPage'));
const Companiespage = lazy(() => import('@app/pages/CompaniesPages/Companiespage'));
const CompaniesThatBoughtInfoPage = lazy(() => import('@app/pages/CompaniesPages/CompaniesThatBoughtInfoPage'));
const CompanyDetailPage = lazy(() => import('@app/pages/CompaniesPages/CompanytDetailsPage'));
const AddCompaniesPage = lazy(() => import('@app/pages/CompaniesPages/AddCompanyPage'));
const EditCompaniesPage = lazy(() => import('@app/pages/CompaniesPages/EditCompanyPage'));
const PotentialClientsPage = lazy(() => import('@app/pages/CompaniesPages/PotentialClientsPage'));
const BranchesPage = lazy(() => import('@app/pages/CompaniesPages/BranchPage'));
const BranchDetailPage = lazy(() => import('@app/pages/CompaniesPages/BranchDetailsPage'));
const AddBranchPage = lazy(() => import('@app/pages/CompaniesPages/AddBranchPage'));
const EditBranchPage = lazy(() => import('@app/pages/CompaniesPages/EditBranchPage'));
const BrokerspPage = lazy(() => import('@app/pages/UsersPages/BrokersPage'));
const BrokersDetailsPage = lazy(() => import('@app/pages/UsersPages/BrokerDetailsPage'));
const RejectReasonsPage = lazy(() => import('@app/pages/RejectReason/RejectReasonsPage'));
const Partnerspage = lazy(() => import('@app/pages/REMPages/PartnersPage'));
const REMDetailPage = lazy(() => import('@app/pages/REMPages/REMDetailsPage'));
const AskForHelpPage = lazy(() => import('@app/pages/OtherPages/HelpRequestsPage'));
const FrequentlyQuestionPage = lazy(() => import('@app/pages/OtherPages/FrequentlyQuestionsPage'));
const ConfigurationsPage = lazy(() => import('@app/pages/OtherPages/ConfigurationsPage'));
const PointPage = lazy(() => import('@app/pages/PointsPages/PointPage'));
const ReviewDetailsPage = lazy(() => import('@app/pages/CompaniesPages/ReviewsDetailsPage'));
const CommissionGroupPage = lazy(() => import('@app/pages/CommissionGroupsPages/CommissionGroupsPage'));
const FeaturedBundlePage = lazy(() => import('@app/pages/PointsPages/FeaturedBundlesPage'));
const ApplicationsVersionPage = lazy(() => import('@app/pages/ApplicationsVersionsPages/ApplicationsVersionsPage'));
const PaymentPage = lazy(() => import('@app/pages/Payments/PaymentsPage'));
const ComparePage = lazy(() => import('@app/pages/CompaniesPages/ComparePage'));
const BranchesWithoutCompanyPage = lazy(
  () => import('@app/pages/BranchesWithoutCompanyPages/BranchesWithoutCompanyPages'),
);

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);
const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);
const StatisticsAdminPage = withLoading(StatisticsAdmin);
const UsersPage = withLoading(UserPage);
const ManagersPage = withLoading(ManagerPage);
const ServicesPage = withLoading(ServicePage);
const SubServicesPage = withLoading(SubServicePage);
const ToolsPage = withLoading(ToolPage);
const SourceTypesPage = withLoading(SourceTypePage);
const TypesForSourcePage = withLoading(TypeForSourcePage);
const ParentAttributeChoicesPage = withLoading(ParentAttributeChoicePage);
const ChildAttributeChoicesPage = withLoading(ChildAttributeChoicePage);
const CountriesPage = withLoading(CountryPage);
const CitiesPage = withLoading(CityPage);
const RegionsPage = withLoading(RegionPage);
const NotificationsPage = withLoading(Notifications);
const TermsPage = withLoading(Terms);
const ContactUsPage = withLoading(ContactusPage);
const PrivacyPolicyPage = withLoading(PrivacyPolicy);
const PaymentPrivacyPage = withLoading(PaymentPrivacy);
const RolesPage = withLoading(RolePage);
const RequestsPage = withLoading(RequestPage);
const HisRequestsPage = withLoading(HisRequestPage);
const RequestDetailsPage = withLoading(RequestDetailPage);
const SuitableCompaniesPage = withLoading(SuitableCompanyPage);
const OffersPage = withLoading(OfferPage);
const OffersDetailsPage = withLoading(OfferDetailsPage);
const AddRequestsPage = withLoading(AddRequestPage);
const EditRequestsPage = withLoading(EditRequestPage);
const CompleteDraftsPage = withLoading(CompleteDraftPage);
const DraftsPage = withLoading(DraftPage);
const CompanyPage = withLoading(Companiespage);
const CompanyThatBoughtInfoPage = withLoading(CompaniesThatBoughtInfoPage);
const CompanyDetailsPage = withLoading(CompanyDetailPage);
const AddCompanyPage = withLoading(AddCompaniesPage);
const EditCompanyPage = withLoading(EditCompaniesPage);
const PotentialClientPage = withLoading(PotentialClientsPage);
const BranchPage = withLoading(BranchesPage);
const BranchDetailsPage = withLoading(BranchDetailPage);
const AddBranchesPage = withLoading(AddBranchPage);
const EditBranchesPage = withLoading(EditBranchPage);
const BrokerPage = withLoading(BrokerspPage);
const BrokerDetailsPage = withLoading(BrokersDetailsPage);
const RejectReasonPage = withLoading(RejectReasonsPage);
const PartnerPage = withLoading(Partnerspage);
const REMDetailsPage = withLoading(REMDetailPage);
const AskForHelpsPage = withLoading(AskForHelpPage);
const FrequentlyQuestionsPage = withLoading(FrequentlyQuestionPage);
const ConfigurationPage = withLoading(ConfigurationsPage);
const PointsPage = withLoading(PointPage);
const ReviewsDetailsPage = withLoading(ReviewDetailsPage);
const CommissionGroupsPage = withLoading(CommissionGroupPage);
const FeaturedBundlesPage = withLoading(FeaturedBundlePage);
const ApplicationsVersionsPage = withLoading(ApplicationsVersionPage);
const PaymentsPage = withLoading(PaymentPage);
const ComparisonPage = withLoading(ComparePage);
const BranchWithoutCompanyPage = withLoading(BranchesWithoutCompanyPage);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={protectedLayout}>
          <Route
            index
            element={
              <PrivateRoute allowedPermissions={[]}>
                <StatisticsAdminPage />
              </PrivateRoute>
            }
          />

          <Route
            path="user-management"
            element={
              <PrivateRoute allowedPermissions={['Pages.Users.List']}>
                <UsersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="user-management/:userId/requests"
            element={
              <PrivateRoute allowedPermissions={['Request.List']}>
                <HisRequestsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="user-management/:userId/requests/:requestId/details"
            element={
              <PrivateRoute allowedPermissions={['Request.Get']}>
                <RequestDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="user-management/:userId/requests/:requestId/details/:type"
            element={
              <PrivateRoute allowedPermissions={['Company.List']}>
                <CompanyThatBoughtInfoPage />
              </PrivateRoute>
            }
          />

          <Route
            path="user-management/:userId/requests/:requestId/details/:type/:companyId/details"
            element={
              <PrivateRoute allowedPermissions={['Company.Get']}>
                <CompanyDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="user-management/:userId/requests/:requestId/details/:type/:companyId/details/reviewsDetails"
            element={
              <PrivateRoute allowedPermissions={[]}>
                <ReviewsDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="user-management/:userId/requests/:requestId/details/wasSent/:type"
            element={
              <PrivateRoute allowedPermissions={['Company.List']}>
                <SuitableCompaniesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="user-management/:userId/requests/:requestId/details/offers/:type"
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'user-management/:userId/requests/:requestId/details/offers/:type/:offerId/details'}
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'user-management/:userId/requests/:requestId/details/:offerId/details'}
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="manager-management"
            element={
              <PrivateRoute allowedPermissions={['Pages.Users']}>
                <ManagersPage />
              </PrivateRoute>
            }
          />

          {/* Requests */}
          <Route
            path="requests"
            element={
              <PrivateRoute allowedPermissions={['Request.List']}>
                <RequestsPage />
              </PrivateRoute>
            }
          />

          {/* Add Requests */}
          <Route
            path=":userId/addRequest"
            element={
              <PrivateRoute allowedPermissions={['Request.Create']}>
                <AddRequestsPage />
              </PrivateRoute>
            }
          />

          {/* Complete Draft */}
          <Route
            path=":userId/drafts/:draftId/completeDraft"
            element={
              <PrivateRoute allowedPermissions={['Request.Create']}>
                <CompleteDraftsPage />
              </PrivateRoute>
            }
          />

          {/*  Drafts */}
          <Route
            path=":userId/drafts"
            element={
              <PrivateRoute allowedPermissions={['Request.List']}>
                <DraftsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details"
            element={
              <PrivateRoute allowedPermissions={['Request.Get']}>
                <RequestDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details/:type"
            element={
              <PrivateRoute allowedPermissions={['Company.List']}>
                <CompanyThatBoughtInfoPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details/:type/:companyId/details/reviewsDetails"
            element={
              <PrivateRoute allowedPermissions={[]}>
                <ReviewsDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details/:type/:companyId/branches/:branchId/details/reviewsDetails"
            element={
              <PrivateRoute allowedPermissions={[]}>
                <ReviewsDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/EditRequest"
            element={
              <PrivateRoute allowedPermissions={['Request.Update']}>
                <EditRequestsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/suitableCompanies&Branches/:type"
            element={
              <PrivateRoute allowedPermissions={['Company.List']}>
                <SuitableCompaniesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details/wasSent/:type"
            element={
              <PrivateRoute allowedPermissions={['Company.List']}>
                <SuitableCompaniesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/offers"
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details/offers/:type"
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'requests/:requestId/details/offers/:type/:offerId/details'}
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'requests/:requestId/offers/:offerId/details'}
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'requests/:requestId/details/:offerId/details'}
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details/:type/:companyId/details"
            element={
              <PrivateRoute allowedPermissions={['Company.Get']}>
                <CompanyDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details/:type/:companyId/branches/:branchId/details"
            element={
              <PrivateRoute allowedPermissions={['CompanyBranch.Get']}>
                <BranchDetailsPage />
              </PrivateRoute>
            }
          />

          {/* Companies */}
          <Route
            path="companies"
            element={
              <PrivateRoute allowedPermissions={['Company.List']}>
                <CompanyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="addCompany"
            element={
              <PrivateRoute allowedPermissions={['Company.Create']}>
                <AddCompanyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/EditCompany"
            element={
              <PrivateRoute allowedPermissions={['Company.Update']}>
                <EditCompanyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/offers"
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/potentialClients"
            element={
              <PrivateRoute allowedPermissions={['Request.List']}>
                <PotentialClientPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/potentialClients/:possibleClientId/details"
            element={
              <PrivateRoute allowedPermissions={['Request.Get']}>
                <RequestDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'companies/:companyId/offers/:offerId/details'}
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/details"
            element={
              <PrivateRoute allowedPermissions={['Company.Get']}>
                <CompanyDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/details/reviewsDetails"
            element={
              <PrivateRoute allowedPermissions={[]}>
                <ReviewsDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/comparison"
            element={
              <PrivateRoute allowedPermissions={['Company.ChangeStatues', 'Company.Get']}>
                <ComparisonPage />
              </PrivateRoute>
            }
          />

          {/* Branches Without Company */}
          <Route
            path="branchesWithoutCompany"
            element={
              <PrivateRoute allowedPermissions={['CompanyBranch.List']}>
                <BranchWithoutCompanyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="branchesWithoutCompany/:branchId/details"
            element={
              <PrivateRoute allowedPermissions={['CompanyBranch.Get']}>
                <BranchDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="branchesWithoutCompany/:branchId/details/reviewsDetails"
            element={
              <PrivateRoute allowedPermissions={[]}>
                <ReviewsDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="branchesWithoutCompany/:branchId/EditBranch"
            element={
              <PrivateRoute allowedPermissions={['CompanyBranch.Update']}>
                <EditBranchesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="branchesWithoutCompany/:branchId/offers"
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'branchesWithoutCompany/:branchId/offers/:offerId/details'}
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          {/* Commission groups */}
          <Route
            path="commissionGroups"
            element={
              <PrivateRoute allowedPermissions={['CommissionGroup.FullControl']}>
                <CommissionGroupsPage />
              </PrivateRoute>
            }
          />

          {/* Bundles */}
          <Route
            path="Points"
            element={
              <PrivateRoute allowedPermissions={['Points.FullControl']}>
                <PointsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="FeaturedBundles"
            element={
              <PrivateRoute allowedPermissions={['Points.FullControl']}>
                <FeaturedBundlesPage />
              </PrivateRoute>
            }
          />

          {/* Branches */}
          <Route
            path="companies/:companyId/branches"
            element={
              <PrivateRoute allowedPermissions={['CompanyBranch.List']}>
                <BranchPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/AddBranch"
            element={
              <PrivateRoute allowedPermissions={['CompanyBranch.Create']}>
                <AddBranchesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/branches/:branchId/offers"
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'companies/:companyId/branches/:branchId/offers/:offerId/details'}
            element={
              <PrivateRoute allowedPermissions={['Offer.List']}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/branches/:branchId/details"
            element={
              <PrivateRoute allowedPermissions={['CompanyBranch.Get']}>
                <BranchDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/branches/:branchId/details/reviewsDetails"
            element={
              <PrivateRoute allowedPermissions={[]}>
                <ReviewsDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/branches/:branchId/EditBranch"
            element={
              <PrivateRoute allowedPermissions={['CompanyBranch.Update']}>
                <EditBranchesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Brokers"
            element={
              <PrivateRoute allowedPermissions={['Broker.FullControl']}>
                <BrokerPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Brokers/:brokerId/details"
            element={
              <PrivateRoute allowedPermissions={['Broker.FullControl']}>
                <BrokerDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Brokers/:brokerId/details/requests/:type"
            element={
              <PrivateRoute allowedPermissions={['Request.List']}>
                <RequestsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Brokers/:brokerId/details/requests/:type/:requestId/details"
            element={
              <PrivateRoute allowedPermissions={['Request.Get']}>
                <RequestDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Brokers/:brokerId/details/:codeBroker/clients/:type"
            element={
              <PrivateRoute allowedPermissions={['Pages.Users.List']}>
                <UsersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="RejectReason"
            element={
              <PrivateRoute allowedPermissions={['RejectReason.FullControl']}>
                <RejectReasonPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Partners"
            element={
              <PrivateRoute allowedPermissions={['Partner.FullControl']}>
                <PartnerPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Partners/:partnerId/details"
            element={
              <PrivateRoute allowedPermissions={['Partner.FullControl']}>
                <REMDetailsPage />
              </PrivateRoute>
            }
          />

          {/* Services */}
          <Route
            path="services"
            element={
              <PrivateRoute allowedPermissions={['Service.FullControl']}>
                <ServicesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="services/:serviceId/subService"
            element={
              <PrivateRoute allowedPermissions={['SubService.FullControl']}>
                <SubServicesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="services/:serviceId/tools"
            element={
              <PrivateRoute allowedPermissions={['Tool.FullControl']}>
                <ToolsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/services/:serviceId/subService/:subServiceId/tools"
            element={
              <PrivateRoute allowedPermissions={['Tool.FullControl']}>
                <ToolsPage />
              </PrivateRoute>
            }
          />

          {/* SourceType */}
          <Route
            path="sourceType"
            element={
              <PrivateRoute allowedPermissions={['SourceType.FullControl']}>
                <SourceTypesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="sourceType/:sourceTypeId/attributeForSource"
            element={
              <PrivateRoute allowedPermissions={['AttributeForSourceType.FullControl']}>
                <TypesForSourcePage />
              </PrivateRoute>
            }
          />

          <Route
            path="sourceType/:sourceTypeId/attributeForSource/:attributeForSourceId/attributes"
            element={
              <PrivateRoute allowedPermissions={['AttributeChoice.FullControl']}>
                <ParentAttributeChoicesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="sourceType/:sourceTypeId/attributeForSource/:attributeForSourceId/attributes/:attributeId/attributesChild"
            element={
              <PrivateRoute allowedPermissions={['AttributeChoice.FullControl']}>
                <ChildAttributeChoicesPage />
              </PrivateRoute>
            }
          />

          {/* Locations */}
          <Route
            path="locations/countries"
            element={
              <PrivateRoute allowedPermissions={['Country.FullControl']}>
                <CountriesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="locations/countries/:countryId/cities"
            element={
              <PrivateRoute allowedPermissions={['City.FullControl']}>
                <CitiesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="locations/countries/:countryId/cities/:cityId/regions"
            element={
              <PrivateRoute allowedPermissions={['Region.FullControl']}>
                <RegionsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Notifications"
            element={
              <PrivateRoute allowedPermissions={[]}>
                <NotificationsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="roles"
            element={
              <PrivateRoute allowedPermissions={['Pages.Roles.List']}>
                <RolesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="contactUs"
            element={
              <PrivateRoute allowedPermissions={['ContactUs.FullControl']}>
                <ContactUsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="PrivacyPolicy"
            element={
              <PrivateRoute allowedPermissions={['PrivacyPolicy.FullControl']}>
                <PrivacyPolicyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="PaymentPrivacy"
            element={
              <PrivateRoute allowedPermissions={['PrivacyPolicy.FullControl']}>
                <PaymentPrivacyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="terms"
            element={
              <PrivateRoute allowedPermissions={['Terms.FullControl']}>
                <TermsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="askForHelp"
            element={
              <PrivateRoute allowedPermissions={['Request.List']}>
                <AskForHelpsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="frequentlyQuestions"
            element={
              <PrivateRoute allowedPermissions={['FrequencyQuestion.FullControl']}>
                <FrequentlyQuestionsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="ApplicationsVersions"
            element={
              <PrivateRoute allowedPermissions={['ApkBuild.FullControl']}>
                <ApplicationsVersionsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="configurations"
            element={
              <PrivateRoute
                allowedPermissions={[
                  'GetCommissionForBranchesWithoutCompany',
                  'GetDiscountPercentage',
                  'GetEmailSetting',
                  'GetFileSizeSetting',
                  'GetHoursInSystem',
                  'GetSmsSetting',
                ]}
              >
                <ConfigurationPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Payments"
            element={
              <PrivateRoute allowedPermissions={[]}>
                <PaymentsPage />
              </PrivateRoute>
            }
          />

          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
