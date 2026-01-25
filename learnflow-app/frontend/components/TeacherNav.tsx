'use client';

import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';

export default function TeacherNav() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-right">
        <p className="font-semibold text-foreground">{user?.name || 'Teacher'}</p>
        <p className="text-muted-foreground">{user?.email || 'teacher@example.com'}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-stellar text-primary-foreground font-bold text-sm">
        {user?.name?.[0].toUpperCase() || 'T'}
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        className="border-cosmic-purple/30 hover:border-cosmic-purple/60 hover:bg-cosmic-purple/10 text-foreground"
      >
        Logout
      </Button>
    </div>
  );
}
