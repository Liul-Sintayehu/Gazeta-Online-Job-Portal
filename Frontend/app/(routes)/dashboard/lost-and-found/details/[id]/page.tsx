// 'use client';

// import PageNavbar, {
//   PageNavbarLeftContent,
//   PageNavbarRightContent,
// } from '@/app/_components/layout/PageNavbar';
// import Breadcrumb from '@/app/_components/ui/Breadcrumb';
// import { TbShoppingBagSearch } from 'react-icons/tb';
// import { routes } from '@/lib/links';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
// import BackButton from '@/app/_components/common/BrowserBackButton';
// import DetailLostAndFound from '@/components/ui/lost-and-found/detail/DetailLostAndFound';
// import { useAuthorization } from '@/app/_hooks/useAuthorization';
// import Spinner from '@/app/_components/common/Spinner';

// export default function page() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { id } = useParams();
//   const callbackUrl = searchParams.get('callbackUrl');
//   const [lostAndFoundId, setLostAndFoundId] = useState<number | null>(null);

//   const isAuthorized = useAuthorization('LostAndFoundItems-GetById');

//   useEffect(() => {
//     if (isAuthorized === false) {
//       router.push('/dashboard/403');
//     }
//   }, [isAuthorized, router]);

//   useEffect(() => {
//     if (id) {
//       const idNumber = Number(id);
//       if (!isNaN(idNumber)) {
//         setLostAndFoundId(idNumber);
//       } else {
//         toast.error('Invalid parameter');
//         router.push('/404');
//       }
//     }
//   }, [id, router]);

//   if (isAuthorized === null || lostAndFoundId === null) {
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
//                   label: 'Detail',
//                   to: `${routes.lostFound}/details/${lostAndFoundId}`,
//                   active: true,
//                 },
//               ]}
//             />
//           </div>
//         </PageNavbarLeftContent>

//         <PageNavbarRightContent className="pr-2"></PageNavbarRightContent>
//       </PageNavbar>
//       <div className="ml-4 mt-2">
//         <BackButton fallbackUrl={routes.lostFound} />

//         <DetailLostAndFound lostAndFoundId={lostAndFoundId} />
//       </div>
//     </>
//   );
// }
