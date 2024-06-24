import { ModalProps as AntdModalProps } from 'antd';
import {
  ServiceModel,
  UserModel,
  CountryModel,
  CityModel,
  RegionModel,
  ContactUsModel,
  CompanyModal,
  SourceTypeModel,
  Partner,
  RoleModel,
  Broker,
  RequestModel,
  BranchModel,
  faqModel,
  Code,
  Point,
  RejectReason,
  EmailConfig,
  SmsConfig,
  FileSizeConfig,
  HoursConfig,
  ApplicationsVersion,
  DiscountPercentageConfig,
  offerModel,
  CommiossionSettingConfig,
  TermModal,
  PrivacyPolicyModal,
} from '@app/interfaces/interfaces';
import { Notification } from '@app/components/Admin/Notifications';

export interface ModalProps {
  visible: boolean;
  isLoading?: boolean;
  onCancel: () => void;
  title?: string;
}

export interface CreateUserModalProps extends ModalProps {
  onCreateManager: (managerInfo: UserModel) => void;
}
export interface CreateBranchModalProps extends ModalProps {
  onCreate: (info: BranchModel) => void;
}
export interface CreatePartnerModalProps extends ModalProps {
  onCreatePartner: (PartnerInfo: Partner) => void;
}

export interface CreateNumberModalProps extends ModalProps {
  onCreate: (info: string) => void;
}

export interface CreateContactModalProps extends ModalProps {
  onCreate: (info: ContactUsModel) => void;
}

export interface CreateRejectReasonModalProps extends ModalProps {
  onCreate: (info: RejectReason) => void;
}

export interface ChangeAcceptRequestOrPotentialClientProps extends ModalProps {
  onEdit: (info: any) => void;
  title: string;
  values: any | undefined;
}

export interface CreatePointModalProps extends ModalProps {
  onCreate: (info: Point) => void;
}

export interface CreateGroupModalProps extends ModalProps {
  onCreate: (info: any) => void;
}

export interface CreateCodeModalProps extends ModalProps {
  onCreateCode: (CodeInfo: Code) => void;
}
export interface CreateRoleModalProps extends ModalProps {
  onCreate: (info: RoleModel) => void;
}

export interface CreateServiceModalProps extends ModalProps {
  onCreateService: (info: ServiceModel) => void;
}

export interface CreateFAQModalProps extends ModalProps {
  onCreateFAQ: (info: faqModel) => void;
}
export interface CreateBrokrModalProps extends ModalProps {
  onCreateBroker: (info: Broker) => void;
}

export interface CreateApplicationsVersionsModalProps extends ModalProps {
  onCreate: (info: ApplicationsVersion) => void;
}

export interface CreateModalProps extends ModalProps {
  onCreate: (info: SourceTypeModel) => void;
  type?: string;
}
export interface SearchForUserModalProps extends ModalProps {
  onCreate: (info: any, userId: number) => void;
}

export interface SendRejectReasons extends ModalProps {
  onCreate: (info: any) => void;
  type: string;
}

export interface CheckPINModalProps extends ModalProps {
  onCreate: (info: any) => void;
}

export interface CreateCountryModalProps extends ModalProps {
  onCreateCountry: (countryInfo: CountryModel) => void;
}

export interface CreateCityModalProps extends ModalProps {
  onCreateCity: (cityInfo: CityModel) => void;
}

export interface CreateRegionModalProps extends ModalProps {
  onCreate: (Info: RegionModel) => void;
}

export interface CreateNotificationModalProps extends ModalProps {
  onCreateNotification: (Notification: Notification) => void;
  isManager: boolean;
}
export interface CreateprivacyModalProps extends ModalProps {
  onCreateprivacy: (PrivacyPolicy: PrivacyPolicyModal) => void;
}
export interface CreateTermModalProps extends ModalProps {
  onCreateTerm: (Term: TermModal) => void;
}
export interface EditTermprops extends ModalProps {
  values: TermModal | undefined;
  onEdit: (data: TermModal) => void;
}

export interface EditManagerProps extends ModalProps {
  manager_values: UserModel | undefined;
  onEdit: (data: UserModel) => void;
}

export interface EditServiceProps extends ModalProps {
  values: ServiceModel | undefined;
  onEdit: (data: ServiceModel) => void;
  AttachmentId: number;
}

export interface EditOfferProps extends ModalProps {
  values: offerModel | undefined;
  onEdit: (data: offerModel) => void;
}

export interface EditFAQProps extends ModalProps {
  values: faqModel | undefined;
  onEdit: (data: faqModel) => void;
}
export interface EditPartnerProps extends ModalProps {
  Partner_values: Partner | undefined;
  onEdit: (data: Partner) => void;
}

export interface EditPointProps extends ModalProps {
  values: Point | undefined;
  onEdit: (data: Point) => void;
}

export interface EditGroupProps extends ModalProps {
  values: any | undefined;
  onEdit: (data: any) => void;
}

export interface EditRejectReasonProps extends ModalProps {
  values: RejectReason | undefined;
  onEdit: (data: RejectReason) => void;
}
export interface EditApplicationsVersionProps extends ModalProps {
  values: ApplicationsVersion | undefined;
  onEdit: (data: ApplicationsVersion) => void;
}
export interface EditBrokerProps extends ModalProps {
  values: Broker | undefined;
  onEdit: (data: Broker) => void;
}
export interface EditProps extends ModalProps {
  values: SourceTypeModel | undefined;
  onEdit: (data: SourceTypeModel) => void;
  iconId: number;
}

export interface EditCountryProps extends ModalProps {
  country_values: CountryModel | undefined;
  onEdit: (data: CountryModel) => void;
}

export interface EditCityProps extends ModalProps {
  city_values: CityModel | undefined;
  onEdit: (data: CityModel) => void;
}

export interface ChangeNecessaryToUpdateProps extends ModalProps {
  values: ApplicationsVersion | undefined;
  onEdit: (data: ApplicationsVersion) => void;
}

export interface EditFileSizeSettingProps extends ModalProps {
  values: FileSizeConfig | undefined;
  onEdit: (data: FileSizeConfig) => void;
}

export interface EditHoursInSystemSettingProps extends ModalProps {
  values: HoursConfig | undefined;
  onEdit: (data: HoursConfig) => void;
}

export interface EditEmailSettingProps extends ModalProps {
  values: EmailConfig | undefined;
  onEdit: (data: EmailConfig) => void;
}

export interface EditDiscountPercentageSettingProps extends ModalProps {
  values: DiscountPercentageConfig | undefined;
  onEdit: (data: DiscountPercentageConfig) => void;
}

export interface EditCommissionSettingProps extends ModalProps {
  values: CommiossionSettingConfig | undefined;
  onEdit: (data: CommiossionSettingConfig) => void;
}

export interface EditSmsSettingProps extends ModalProps {
  values: SmsConfig | undefined;
  onEdit: (data: SmsConfig) => void;
}

export interface EditRegionProps extends ModalProps {
  values: RegionModel | undefined;
  onEdit: (data: RegionModel) => void;
}
export interface EditRoleProps extends ModalProps {
  values: RoleModel | undefined;
  onEdit: (data: RoleModel) => void;
}
export interface EditRequestProps extends ModalProps {
  values: RequestModel | undefined;
  onEdit: (data: RequestModel) => void;
}
export interface EditContactProps extends ModalProps {
  contact_values: ContactUsModel | undefined;
  onEdit: (data: ContactUsModel) => void;
}
export interface EditNotifactionprops extends ModalProps {
  Not_values: Notification | undefined;
  onEdit: (data: Notification) => void;
}
export interface Editprivacyprops extends ModalProps {
  values: PrivacyPolicyModal | undefined;
  onEdit: (data: PrivacyPolicyModal) => void;
}

export interface EditCompanyProps extends ModalProps {
  Company_values: CompanyModal | undefined;
  onEdit: (data: CompanyModal) => void;
}

export interface ActionModalProps extends AntdModalProps {
  visible: boolean;
  onCancel?: () => void;
  onOK?: (id: any) => void;
  title?: string;
  okText?: string;
  cancelText?: string;
  description?: string;
  okButtonType?: 'default' | 'link' | 'text' | 'ghost' | 'primary' | 'dashed' | undefined;
  isDanger?: boolean;
  isLoading?: boolean;
  element?: React.ReactNode;
  isHiddenOkButton?: boolean;
  isHiddenCancelButton?: boolean;
  ModalSize?: 'small' | 'medium' | 'large';
  onHideFooter?: boolean;
}
