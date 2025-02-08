'use client';

//import useClearSessionOnPathChange from '@/components/ui/master_data/employee/clear';
import { redirect } from 'next/navigation';

function Home() {
  //useClearSessionOnPathChange();
  redirect('/dashboard');
}

export default Home;
