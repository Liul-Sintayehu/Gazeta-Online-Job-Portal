// 'use client';
// import React, { useEffect } from 'react';
// import Link from 'next/link';
// import { Bell } from 'lucide-react';
// import { useNotificationStore } from '../notifications/NotificationStore';
// import { fetchUnreadNotificationCount } from '@/app/_lib/data/notifications';
// import { usePathname } from 'next/navigation';
// import { toast } from 'sonner';

// const alertAudioPath = '/audios/notification-alert-2.mp3';

// const NotificationNavBar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
//   const pathname = usePathname();

//   const unreadNotificationsCount = useNotificationStore(
//     state => state.unreadNotificationsCount,
//   );
//   const setUnreadNotificationsCount = useNotificationStore(
//     state => state.setUnreadNotificationsCount,
//   );

//   useEffect(() => {
//     const fetchNumberOfUnreadNotification = async () => {
//       try {
//         const response = await fetchUnreadNotificationCount();

//         const previousNotificationsCount = parseInt(
//           localStorage.getItem('previousNotificationsCount') || '0',
//           10,
//         );

//         if (
//           response.allNotificationsCount > previousNotificationsCount &&
//           response.unreadNotificationsCount > 0
//         ) {
//           const audio = new Audio(alertAudioPath);
//           audio.play();
//           toast.warning('You have received new notification.');
//         }

//         localStorage.setItem(
//           'previousNotificationsCount',
//           response.allNotificationsCount.toString(),
//         );

//         setUnreadNotificationsCount(response.unreadNotificationsCount);
//       } catch (error: any) {
//         setUnreadNotificationsCount(0);
//       }
//     };

//     fetchNumberOfUnreadNotification();

//     const interval = setInterval(() => {
//       fetchNumberOfUnreadNotification();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [setUnreadNotificationsCount]);

//   return (
//     <Link
//       href={'/dashboard/notifications'}
//       className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 ${
//         pathname === '/dashboard/notifications'
//           ? 'bg-green-800 text-white'
//           : 'text-gray-300 hover:bg-gray-700'
//       }`}
//     >
//       <span className="relative">
//         <Bell size={20} />
//         {unreadNotificationsCount > 0 && (
//           <span
//             style={{
//               borderRadius: '9999px',
//               fontSize: '10px',
//               lineHeight: '5px',
//             }}
//             className="z-50 absolute top-1.5 left-2.5 mt-[-10px] mr-[-10px] p-1 text-white bg-red-400"
//           >
//             {unreadNotificationsCount}
//           </span>
//         )}
//       </span>
//       {isSidebarOpen && <span className={`ml-2 text-sm`}>Notifications</span>}
//     </Link>
//   );
// };

// export default NotificationNavBar;
