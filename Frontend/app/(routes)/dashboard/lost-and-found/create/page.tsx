// 'use client';

// import PageNavbar, {
//   PageNavbarLeftContent,
//   PageNavbarRightContent,
// } from '@/app/_components/layout/PageNavbar';
// import Breadcrumb from '@/app/_components/ui/Breadcrumb';
// import { TbShoppingBagSearch } from 'react-icons/tb';
// import { routes } from '@/lib/links';
// import { useRouter, useSearchParams } from 'next/navigation';
// import BackButton from '@/app/_components/common/BrowserBackButton';
// import { CreateLostAndFoundComponent } from '@/components/ui/lost-and-found/create/Create';
// import { useEffect } from 'react';
// import Spinner from '@/app/_components/common/Spinner';
// import { useAuthorization } from '@/app/_hooks/useAuthorization';

// export default function page() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl');

//   const isAuthorized = useAuthorization('LostAndFoundItems-Create');

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
//                 },
//                 {
//                   label: 'Create',
//                   to: `${routes.lostFound}/create?callbackUrl=${callbackUrl}`,
//                   active: true,
//                 },
//               ]}
//             />
//           </div>
//         </PageNavbarLeftContent>

//         <PageNavbarRightContent className="pr-2"></PageNavbarRightContent>
//       </PageNavbar>
//       <div className="ml-4 mt-2">
//         <BackButton fallbackUrl={callbackUrl || undefined} />
//         <CreateLostAndFoundComponent />
//       </div>
//     </>
//   );
// }
