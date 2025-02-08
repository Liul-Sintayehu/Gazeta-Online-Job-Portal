import React from 'react';
import ClearanceSummary from './clearance/ClearanceSummary';

import MasterDataSummary from './master-data/MasterDataSummary';
import WeaponAlertSummary from './weapon-alert/WeaponAlertSummary';
import IncidentsSummary from './incident-handling/IncidentsSummary';
import OffloadBaggagesSummary from './offload-baggages/OffloadBaggagesSummary';
import { LostAndFoundSummary } from './lost-and-found/LostAndFoundSummary';
import EscortSummary from './escort-assignment/EscortSummary';
import { InvestigationSummary } from './investigation/InvestigationSummary';
import { usePermissions } from '@/app/_hooks/usePermissions';

const permissionKeys = [
  'Dashboard-MasterData',
  'Dashboard-Clearance',
  'Dashboard-WeaponAlert',
  'Dashboard-Incident',
  'Dashboard-Investigation',
  'Dashboard-OffloadBaggage',
  'Dashboard-Escort',
  'Dashboard-LostAndFound',
];

type PermissionKey = (typeof permissionKeys)[number];

export default function Dashboard() {
  const permissions = usePermissions<PermissionKey>(permissionKeys);

  return (
    <div className="font-inter m-4 mt-8 grid gap-4 grid-cols-[repeat(auto-fill,minmax(450px,1fr))] auto-rows-auto justify-center">
      <div className="bg-white flex flex-col gap-4">
        {permissions['Dashboard-MasterData'] && <MasterDataSummary />}
        {permissions['Dashboard-Clearance'] && <ClearanceSummary />}
      </div>
      {permissions['Dashboard-WeaponAlert'] && <WeaponAlertSummary />}
      {permissions['Dashboard-Incident'] && <IncidentsSummary />}
      {permissions['Dashboard-Investigation'] && <InvestigationSummary />}
      <div className="grid sm:grid-cols-2 gap-4">
        {permissions['Dashboard-OffloadBaggage'] && <OffloadBaggagesSummary />}
        {permissions['Dashboard-Escort'] && <EscortSummary />}
      </div>
      {permissions['Dashboard-LostAndFound'] && <LostAndFoundSummary />}
    </div>
  );
}
