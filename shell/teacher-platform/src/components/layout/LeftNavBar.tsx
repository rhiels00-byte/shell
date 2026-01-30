import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/', label: '홈', icon: '📍' },
  {
    path: '/tools',
    label: '도구',
    icon: '📦',
    subItems: [
      { path: '/tools', label: '전체' },
      { path: '/tools?category=create', label: '생성' },
      { path: '/tools?category=analyze', label: '분석' },
    ]
  },
  { path: '/chat-history', label: '채팅 내역', icon: '💬' },
  { path: '/materials', label: '만든 자료', icon: '📁' },
  { path: '/settings', label: '설정', icon: '⚙️' },
];

export default function LeftNavBar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">교사 지원 플랫폼</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              {item.subItems ? (
                <div>
                  <div className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <NavLink
                          to={subItem.path}
                          className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-primary-50 text-primary-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
