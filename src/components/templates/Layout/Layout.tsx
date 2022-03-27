import { useState } from 'react';

import SidebarMobile from '@components/organisms/SidebarMobile/SidebarMobile';
import SidebarDesktop from '@components/organisms/SidebarDesktop/SidebarDesktop';
import Navbar from '@components/organisms/Navbar/Navbar';

const Layout: React.FC = ({ children }) => {
  // State for sidebar menu in mobile view
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex overflow-hidden bg-gray-100">
      <SidebarMobile isOpen={isOpen} setIsOpen={setIsOpen} />
      <SidebarDesktop />

      <div className="flex flex-col flex-1 w-0 h-screen overflow-y-auto">
        <div className="overflow-hidden">
          <Navbar setIsOpen={setIsOpen} />
        </div>

        <main className="z-10 flex-1 focus:outline-none" tabIndex={0}>
          <div className="h-full px-4 py-6 mx-auto max-w-7xl sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
