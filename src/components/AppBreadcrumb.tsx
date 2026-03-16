import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const routes: Record<string, string> = {
  '/': 'Home',
  '/forge': 'Password Forge',
};

export default function AppBreadcrumb() {
  const { pathname } = useLocation();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ path: '/', label: 'Home' }];

  let accumulated = '';
  for (const seg of segments) {
    accumulated += `/${seg}`;
    crumbs.push({ path: accumulated, label: routes[accumulated] || seg });
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, i) => (
            <BreadcrumbItem key={crumb.path}>
              {i < crumbs.length - 1 ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path} className="text-muted-foreground hover:text-primary">
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator className="text-muted-foreground/50" />
                </>
              ) : (
                <BreadcrumbPage className="text-foreground">{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
