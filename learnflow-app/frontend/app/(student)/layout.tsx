'use client';

import { ReactNode } from 'react';
import { SidebarLayout } from '@/components/AppSidebar';

export default function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
