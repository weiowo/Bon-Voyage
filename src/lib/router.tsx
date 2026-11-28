'use client';

/* eslint-disable react/jsx-props-no-spreading -- thin wrappers forward all props */

// Thin adapter that keeps the react-router API the views were written against
// (useNavigate / useLocation / Link / HashLink) on top of the Next.js router.

import NextLink from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { forwardRef, useCallback, type ComponentPropsWithoutRef } from 'react';

type To = string | { pathname?: string; search?: string; hash?: string };

function toHref(to: To): string {
  if (typeof to === 'string') return to;
  const { pathname = '', search = '', hash = '' } = to;
  const query = search && !search.startsWith('?') ? `?${search}` : search;
  const fragment = hash && !hash.startsWith('#') ? `#${hash}` : hash;
  return `${pathname}${query}${fragment}`;
}

export function useNavigate() {
  const router = useRouter();
  return useCallback((to: To | number) => {
    if (typeof to === 'number') {
      if (to < 0) router.back();
      else router.forward();
      return;
    }
    router.push(toHref(to));
  }, [router]);
}

export function useLocation() {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const query = searchParams?.toString() ?? '';
  return { pathname, search: query ? `?${query}` : '' };
}

type LinkProps = Omit<ComponentPropsWithoutRef<typeof NextLink>, 'href'> & { to: To };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...rest }, ref) => (
  <NextLink ref={ref} href={toHref(to)} {...rest} />
));
Link.displayName = 'Link';

type HashLinkProps = LinkProps & { smooth?: boolean };

export const HashLink = forwardRef<HTMLAnchorElement, HashLinkProps>((
  { smooth, onClick, ...rest },
  ref,
) => (
  <Link
    ref={ref}
    scroll={!smooth}
    onClick={(e) => {
      onClick?.(e);
      const href = toHref(rest.to);
      const id = href.split('#')[1];
      if (smooth && id) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }}
    {...rest}
  />
));
HashLink.displayName = 'HashLink';
