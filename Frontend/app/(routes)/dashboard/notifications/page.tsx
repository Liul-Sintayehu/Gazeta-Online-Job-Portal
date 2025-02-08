// 'use client';
// import React from 'react';
// import PageNavbar, {
//   PageNavbarLeftContent,
//   PageNavbarRightContent,
// } from '@/app/_components/layout/PageNavbar';
// import NotificationPage from '@/app/_components/notifications/NotificationPage';
// import { Bell } from 'lucide-react';
// import Breadcrumb from '@/app/_components/ui/Breadcrumb';

// export default function Page() {
//   return (
//     <div className="overflow-y-clip">
//       <PageNavbar>
//         <PageNavbarLeftContent>
//           <div className="whitespace-nowrap flex items-center">
//             <Bell color="green" className="text-3xl" />
//             <Breadcrumb
//               breadcrumbs={[
//                 {
//                   label: 'Notifications',
//                   to: `/dashboard/notifications`,
//                   active: true,
//                 },
//               ]}
//             />
//           </div>
//         </PageNavbarLeftContent>
//         <PageNavbarRightContent className="pr-2"></PageNavbarRightContent>
//       </PageNavbar>
//       <NotificationPage />
//     </div>
//   );
// }
