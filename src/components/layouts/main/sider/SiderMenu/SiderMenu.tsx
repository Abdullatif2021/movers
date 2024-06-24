import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { SidebarNavigationItem, sidebarData } from '../sidebarNavigation';
import { Menu } from 'antd';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { UserRole } from '@app/constants/userRole';
import { useLanguage } from '@app/hooks/useLanguage';
interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
}

const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const location = useLocation();

  const user = useAppSelector((state) => state.user.user);

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  const sidebarNavigation = sidebarData[UserRole[user.userType]].filter((item) => {
    if (item?.permissions.length === 0) {
      return item;
    }
    return item?.permissions?.some((permission) => userPermissions.includes(permission));
  });

  const sidebarNavFlat = sidebarNavigation?.reduce(
    (result: SidebarNavigationItem[], current) =>
      result.concat(current.children && current.children.length > 0 ? current.children : current),
    [],
  );

  const currentMenuItem = sidebarNavFlat?.find(({ url }) => url === location.pathname);

  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  const openedSubmenu = sidebarNavigation?.find(({ children }) =>
    children?.some(({ url }) => url === location.pathname),
  );

  const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

  return (
    <S.Menu
      $language={language}
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      onClick={() => setCollapsed(true)}
    >
      {sidebarNavigation?.map((nav) =>
        nav.children && nav.children.length > 0 ? (
          <Menu.SubMenu
            key={nav.key}
            title={t(nav.title)}
            icon={nav.icon}
            onTitleClick={() => setCollapsed(false)}
            popupClassName="d-none"
          >
            {nav.children.map((childNav) => (
              <Menu.Item key={childNav.key} title="">
                <Link to={childNav.url || ''}>{t(childNav.title)}</Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={nav.key} title="" icon={nav.icon}>
            <Link to={nav.url || ''}>{t(nav.title)}</Link>
          </Menu.Item>
        ),
      )}
    </S.Menu>
  );
};

export default SiderMenu;
