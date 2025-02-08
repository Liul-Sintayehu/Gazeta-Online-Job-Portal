// 'use client';

// import PageNavbar, {
//   PageNavbarLeftContent,
//   PageNavbarRightContent,
// } from '@/app/_components/layout/PageNavbar';
// import Breadcrumb from '@/app/_components/ui/Breadcrumb';
// import { TbShoppingBagSearch } from 'react-icons/tb';
// import { routes } from '@/lib/links';
// import LostAndFoundView from '@/components/ui/lost-and-found/view/TableView';
// import { useRouter } from 'next/navigation';
// import { useAuthorization } from '@/app/_hooks/useAuthorization';
// import { useEffect } from 'react';
// import Spinner from '@/app/_components/common/Spinner';

// export default function page() {
//   const router = useRouter();

//   const isAuthorized = useAuthorization('LostAndFoundItems-GetAll');

//   useEffect(() => {
//     if (isAuthorized === false) {
//       router.push('/dashboard/403');
//     }
//   }, [isAuthorized, router]);

//   if (isAuthorized === null) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <Spinner />
//       </div>
//     );
//   }

//   if (!isAuthorized) {
//     return null;
//   }
//   return (
//     <>
//       <PageNavbar>
//         <PageNavbarLeftContent>
//           <div className="whitespace-nowrap flex items-center">
//             <TbShoppingBagSearch color="green" className="text-3xl" />
//             <Breadcrumb
//               breadcrumbs={[
//                 {
//                   label: 'Lost & Found',
//                   to: `${routes.lostFound}`,
//                   active: true,
//                 },
//               ]}
//             />
//           </div>
//         </PageNavbarLeftContent>

//         <PageNavbarRightContent className="pr-2"></PageNavbarRightContent>
//       </PageNavbar>
//       <div className="ml-4 mt-2">
//         <LostAndFoundView />
//       </div>
//     </>
//   );
// }
