/**
 * Sidebar navigation component
 * Provides navigation menu for the test application
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ProfilePicMenu } from 'hazo_auth/components/layouts/shared';
import { COMPONENT_PAGES } from '@/config/component_pages';
import { FORM_SETS } from '@/config/form_sets';
import { 
  HiHome, 
  HiBeaker, 
  HiLogin, 
  HiUserAdd, 
  HiLockClosed, 
  HiMail,
  HiCog,
  HiChat,
  HiClipboardList,
  HiCollection,
  HiUsers
} from 'react-icons/hi';

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  group?: string;
}

const nav_items: NavItem[] = [
  {
    title: 'Welcome',
    href: '/',
    icon: <HiHome className="h-5 w-5" />,
    group: 'general',
  },
  {
    title: 'Package Test',
    href: '/package-test',
    icon: <HiBeaker className="h-5 w-5" />,
    group: 'general',
  },
  {
    title: 'Chat',
    href: '/chat',
    icon: <HiChat className="h-5 w-5" />,
    group: 'general',
  },
  {
    title: 'Tax Checklist',
    href: '/tax-checklist',
    icon: <HiClipboardList className="h-5 w-5" />,
    group: 'general',
  },
  {
    title: 'Login',
    href: '/hazo_auth/login',
    icon: <HiLogin className="h-5 w-5" />,
    group: 'auth',
  },
  {
    title: 'Register',
    href: '/hazo_auth/register',
    icon: <HiUserAdd className="h-5 w-5" />,
    group: 'auth',
  },
  {
    title: 'Forgot Password',
    href: '/hazo_auth/forgot_password',
    icon: <HiLockClosed className="h-5 w-5" />,
    group: 'auth',
  },
  {
    title: 'Verify Email',
    href: '/hazo_auth/verify_email',
    icon: <HiMail className="h-5 w-5" />,
    group: 'auth',
  },
  {
    title: 'My Settings',
    href: '/hazo_auth/my_settings',
    icon: <HiCog className="h-5 w-5" />,
    group: 'auth',
  },
  {
    title: 'User Management',
    href: '/hazo_auth/user_management',
    icon: <HiUsers className="h-5 w-5" />,
    group: 'auth',
  },
];

/**
 * Sidebar component
 */
export function Sidebar() {
  const pathname = usePathname();

  const general_items = nav_items.filter(item => item.group === 'general');
  const auth_items = nav_items.filter(item => item.group === 'auth');
  
  // Convert component pages config to nav items
  const component_items: NavItem[] = COMPONENT_PAGES.map(config => ({
    title: config.title,
    href: config.path,
    icon: config.icon(),
    group: 'components',
  }));
  
  // Convert form sets config to nav items
  const form_set_items: NavItem[] = Object.entries(FORM_SETS).map(([id, config]) => ({
    title: config.title,
    href: `/form-set/${id}`,
    icon: <HiCollection className="h-5 w-5" />,
    group: 'form-sets',
  }));

  return (
    <div className="cls_sidebar_container flex h-full w-64 flex-col border-r bg-background">
      <div className="cls_sidebar_header flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Hazo Collab Forms</h2>
      </div>
      <nav className="cls_sidebar_nav flex-1 space-y-1 p-4 overflow-y-auto">
        {/* Form Sets Navigation */}
        <div className="cls_nav_group_form_sets mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Form Set
          </p>
          {form_set_items.map((item) => {
            const is_active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'cls_nav_item flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1',
                  is_active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.title}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Components Navigation */}
        <div className="cls_nav_group_components mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Components
          </p>
          {component_items.map((item) => {
            const is_active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'cls_nav_item flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1',
                  is_active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.title}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Auth Navigation */}
        <div className="cls_nav_group_auth mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Authentication
          </p>
          {auth_items.map((item) => {
            const is_active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'cls_nav_item flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1',
                  is_active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.title}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* General Navigation */}
        <div className="cls_nav_group_general mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            General
          </p>
          {general_items.map((item) => {
            const is_active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'cls_nav_item flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1',
                  is_active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>
      <Separator />
      {/* Profile Picture Menu */}
      <div className="cls_sidebar_profile p-4">
        <ProfilePicMenu 
          variant="dropdown"
          avatar_size="sm"
        />
      </div>
    </div>
  );
}

