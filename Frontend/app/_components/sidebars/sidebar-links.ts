import {
  Plane,
  Users,
  Clipboard,
  Text,
  PlaneTakeoff,
  FileText,
  BaggageClaim,
  TriangleAlert,
  Signpost,
  CarTaxiFront,
  TowerControl,
  Microscope,
  MapPin,
  ListTodo,
} from 'lucide-react';
import {
  FaPlaneCircleExclamation,
  FaPersonFalling,
  FaCarBurst,
  FaPersonRifle,
} from 'react-icons/fa6';
import { GiRobber } from 'react-icons/gi';
import { LuFileCheck } from 'react-icons/lu';
import { GoShieldCheck } from 'react-icons/go';
import { TbLuggageOff } from 'react-icons/tb';
import { TbShoppingBagSearch } from 'react-icons/tb';
import { GrUserPolice } from 'react-icons/gr';
import { routes } from '@/lib/links';

export interface SideBarLink {
  label: string;
  link: string;
  icon: React.ElementType;
  claim: string;
  children?: SideBarLink[];
}
export const sidebarLinks: SideBarLink[] = [
  {
    label: 'Master Data',
    link: '#',
    icon: Text,
    claim: 'MasterData-View',
    children: [
      {
        label: 'Employees',
        link: '/dashboard/employees',
        icon: Users,
        claim: 'Employee-GetAll',
      },
      // {
      //   label: 'Aircraft',
      //   link: '/dashboard/aircrafts',
      //   icon: Plane,
      //   claim: 'AircraftType-GetAll',
      // },
      // {
      //   label: 'Major Tasks',
      //   link: '/dashboard/majortasks',
      //   icon: Clipboard,
      //   claim: 'MajorTask-GetAll',
      // },
      {
        label: 'Clearance Tasks',
        link: '/dashboard/tasks',
        icon: ListTodo,
        claim: 'SubTask-GetAll',
      },
      {
        label: 'Locations',
        link: '/dashboard/locations',
        icon: MapPin,
        claim: 'Location-GetAll',
      },
      {
        label: 'Posts',
        link: '/dashboard/posts',
        icon: Signpost,
        claim: 'Post-GetAll',
      },
    ],
  },
  {
    label: 'Flight Clearance',
    link: '#',
    icon: GoShieldCheck,
    claim: 'flight-clearance',
    children: [
      {
        label: 'Flight Schedule',
        link: '/dashboard/clearance/flight-schedule',
        icon: PlaneTakeoff,
        claim: 'ClearanceAssignment-GetAll',
      },
      {
        label: 'Approval Report',
        link: '/dashboard/clearance/report',
        icon: LuFileCheck,
        claim: 'ClearanceAssignment-GetApprovalReport',
      },
    ],
  },
  {
    label: 'Weapon Handling',
    link: '#',
    icon: FaPersonRifle,
    claim: 'weapon-handling',
    children: [
      {
        label: 'Flight Schedule',
        link: '/dashboard/weapon-alert/flight-schedule',
        icon: PlaneTakeoff,
        claim: 'WeaponAlert-GetAll',
      },
      {
        label: 'Reports',
        link: '/dashboard/weapon-alert/report',
        icon: FileText,
        claim: 'WeaponAlert-GetReports',
      },
    ],
  },
  {
    label: 'Incident Handling',
    link: '#',
    icon: TriangleAlert,
    claim: 'incident-handling',
    children: [
      {
        label: 'Aircraft Incident',
        link: routes.aircraftIncident,
        icon: FaPlaneCircleExclamation,
        claim: 'AirCraftIncident-GetAll',
      },
      {
        label: 'Baggage Incident',
        link: routes.baggageIncident,
        icon: BaggageClaim,
        claim: 'BaggageIncident-GetAll',
      },
      {
        label: 'Injury Incident',
        link: routes.injuryIncident,
        icon: FaPersonFalling,
        claim: 'InjuryIncident-GetAll',
      },
      {
        label: 'Theft Incident',
        link: routes.theftIncident,
        icon: GiRobber,
        claim: 'TheftIncident-GetAll',
      },
      {
        label: 'Vehicle Incident',
        link: routes.vehicleIncident,
        icon: FaCarBurst,
        claim: 'VehicleIncident-GetAll',
      },
      {
        label: 'Investigation',
        link: routes.investigation,
        icon: Microscope,
        claim: 'Investigation-GetAll',
      },
    ],
  },
  {
    label: 'Offload Baggage',
    link: '#',
    icon: TbLuggageOff,
    claim: 'offload-baggage',
    children: [
      {
        label: 'Flight Schedule',
        link: '/dashboard/offload-baggage/flight-schedule',
        icon: PlaneTakeoff,
        claim: 'OffloadBaggage-GetFlightSchedule',
      },
      {
        label: 'Reports',
        link: '/dashboard/offload-baggage/report',
        icon: FileText,
        claim: 'OffloadBaggage-GetReports',
      },
    ],
  },
  {
    label: 'Lost & Found',
    link: '/dashboard/lost-and-found',
    icon: TbShoppingBagSearch,
    claim: 'LostAndFoundItems-GetAll',
  },
  {
    label: 'Employee Assignment',
    link: '#',
    icon: GrUserPolice,
    claim: 'employee-assignment',
    children: [
      {
        label: 'Post Assignment',
        link: '/dashboard/officer-assignment/posts',
        icon: TowerControl,
        claim: 'PostAssignment-GetAll',
      },
      {
        label: 'Escort Assignment',
        link: '/dashboard/officer-assignment/escorts',
        icon: CarTaxiFront,
        claim: 'Escort-GetAll',
      },
    ],
  },
];
