import { capitalizeEachWord } from '@/lib/utils';
import { WeaponHandlingResponse } from '../types';
import { Badge } from '@/components/ui/badge';
import { TaskStatusVariantMap, WorkTaskStatus } from '../../common/constants';
import { DetailField, DetailSection } from '../../common/views/detail-views';

type BadgeVariant =
  | 'pending'
  | 'success'
  | 'destructive'
  | 'default'
  | 'outline'
  | 'secondary'
  | 'grey'
  | 'todo'
  | 'inprogress'
  | null
  | undefined;

export const ReportDetail = ({
  weaponHandling,
}: {
  weaponHandling: WeaponHandlingResponse;
}) => {
  const getAssignedStatus = (): { key: BadgeVariant; value: string } => {
    const arrivalTime = new Date(
      weaponHandling.flightSchedule.scheduledArrivalTime,
    ).getTime();
    const assignedTime = weaponHandling.assignedOn
      ? new Date(weaponHandling.assignedOn).getTime()
      : -1;

    if (isNaN(arrivalTime) || isNaN(assignedTime)) {
      return {
        key: 'destructive',
        value: 'Invalid Dates',
      };
    }

    const isArrivalPassed = arrivalTime < Date.now();

    const isAssigned = assignedTime > 0;

    const isAssignedBeforeArrival = assignedTime < arrivalTime;

    if (!isAssigned) {
      return {
        key: 'destructive',
        value: 'Not Assigned',
      };
    } else if (isAssigned && isAssignedBeforeArrival) {
      return {
        key: 'success',
        value: 'On Time (Before Arrival)',
      };
    } else if (isAssigned && !isAssignedBeforeArrival) {
      return {
        key: 'destructive',
        value: 'Late (After Arrival)',
      };
    } else {
      return {
        key: 'destructive',
        value: 'Invalid Dates',
      };
    }
  };

  const getHandleStatus = (): JSX.Element => {
    if (!weaponHandling.responsibleOfficer)
      return <Badge variant={'destructive'}>Not Assigned</Badge>;

    const badgeValue = WorkTaskStatus[weaponHandling.handleStatus - 1];
    const badgeVariant = TaskStatusVariantMap[weaponHandling.handleStatus];
    return <Badge variant={badgeVariant}>{badgeValue}</Badge>;
  };

  return (
    <div
      style={{ borderRadius: '15px' }}
      className="my-2 border rounded-lg shadow-md p-4 max-w-full text-gray-700 font-inter"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4 pb-2">
        <h2 className="text-md font-semibold">
          Detailed Weapon Handling Report
        </h2>
      </div>

      <DetailSection title="Handle Report">
        <DetailField label="Handle Status" value={getHandleStatus()} />
        <DetailField
          label="Assigned Status"
          value={
            <Badge variant={getAssignedStatus().key}>
              {getAssignedStatus().value}
            </Badge>
          }
        />
        <DetailField
          label="Completed On"
          value={
            new Date(weaponHandling.completedOn).getTime() > 0 ? (
              `${new Date(
                weaponHandling.completedOn,
              ).toDateString()}, ${new Date(
                weaponHandling.completedOn,
              ).toLocaleTimeString()}`
            ) : (
              <span className="text-gray-400 text-sm">Not Completed</span>
            )
          }
        />
      </DetailSection>

      <DetailSection title="Registered Weapon Alert">
        <DetailField
          label="Alert Sent On"
          value={`${new Date(weaponHandling.alertSentOn).toDateString()}, 
            ${new Date(weaponHandling.alertSentOn).toLocaleTimeString()}`}
        />
        <DetailField label="Sent By" value={`Not Registered`} />
        <DetailField
          label="Remark"
          value={
            weaponHandling.remark ?? (
              <span className="text-gray-400 text-sm">No Remark!</span>
            )
          }
        />

        {weaponHandling?.alertResentOn && (
          <DetailField
            label="Alert Update Resent On"
            value={`${new Date(weaponHandling.alertResentOn).toDateString()}, 
            ${new Date(weaponHandling.alertResentOn).toLocaleTimeString()}`}
          />
        )}
      </DetailSection>

      <DetailSection title="Officer Assignment">
        <DetailField
          label="Assigned Offier"
          value={
            weaponHandling.responsibleOfficer ? (
              capitalizeEachWord(
                `${weaponHandling.responsibleOfficer?.firstName} ${weaponHandling.responsibleOfficer?.middleName} ${weaponHandling.responsibleOfficer?.lastName}`,
              )
            ) : (
              <span className="text-gray-400 text-sm">Not Assigned Yet!</span>
            )
          }
        />
        <DetailField
          label="First Assigned On"
          value={
            weaponHandling.assignedOn &&
            new Date(weaponHandling.assignedOn).getTime() > 0 ? (
              `${new Date(
                weaponHandling.assignedOn,
              ).toDateString()}, ${new Date(
                weaponHandling.assignedOn,
              ).toLocaleTimeString()}`
            ) : new Date(weaponHandling.assignUpdateOn).getTime() > 0 ? (
              `${new Date(
                weaponHandling.assignUpdateOn,
              ).toDateString()}, ${new Date(
                weaponHandling.assignUpdateOn,
              ).toLocaleTimeString()}`
            ) : (
              <span className="text-gray-400 text-sm">Not Assigned!</span>
            )
          }
        />

        <DetailField
          label="Assignment Updated On"
          value={
            new Date(weaponHandling.assignUpdateOn).getTime() > 0 ? (
              `${new Date(
                weaponHandling.assignUpdateOn,
              ).toDateString()}, ${new Date(
                weaponHandling.assignUpdateOn,
              ).toLocaleTimeString()}`
            ) : (
              <span className="text-gray-400 text-sm">Not Updated</span>
            )
          }
        />

        <DetailField
          label="Assigned By"
          value={
            weaponHandling.assignedBy ? (
              capitalizeEachWord(
                `${weaponHandling.assignedBy?.firstName} ${weaponHandling.assignedBy?.middleName} ${weaponHandling.assignedBy?.lastName}`,
              ) + ` (${weaponHandling.assignedBy?.position.name})`
            ) : (
              <span className="text-gray-400 text-sm">Not Assigned Yet!</span>
            )
          }
        />
      </DetailSection>

      <DetailSection title="Notification/Escalation Report">
        <DetailField
          label="Notification Sent Count"
          value={
            <Badge
              variant={
                weaponHandling.escalationCount == 1
                  ? 'success'
                  : weaponHandling.escalationCount == 2
                  ? 'inprogress'
                  : weaponHandling.escalationCount == 3
                  ? 'todo'
                  : 'destructive'
              }
              className="text-sm ml-4"
            >
              {weaponHandling.escalationCount}
            </Badge>
          }
        />

        <DetailField
          className="col-span-2"
          label="Assigned Action Taken On"
          value={
            <Badge
              variant={
                weaponHandling.escalationCount == 1
                  ? 'success'
                  : weaponHandling.escalationCount == 2
                  ? 'inprogress'
                  : weaponHandling.escalationCount == 3
                  ? 'todo'
                  : 'destructive'
              }
              className=" ml-4"
            >
              {weaponHandling.escalationCount == 1
                ? 'First Alert'
                : weaponHandling.escalationCount == 2
                ? 'Reminder'
                : weaponHandling.escalationCount == 3
                ? 'First Escalation'
                : 'On Plane Arrival'}
            </Badge>
          }
        />
        {weaponHandling.escalationCount > 0 && (
          <DetailField
            label="First Alert Sent On"
            value={`${new Date(
              weaponHandling.alertSentOn,
            ).toDateString()}, ${new Date(
              weaponHandling.alertSentOn,
            ).toLocaleTimeString()}`}
          />
        )}
        {weaponHandling.escalationCount > 1 && (
          <DetailField
            label="Reminder Sent On"
            value={`${new Date(
              weaponHandling.reminderSentOn,
            ).toDateString()}, ${new Date(
              weaponHandling.reminderSentOn,
            ).toLocaleTimeString()}`}
          />
        )}
        {weaponHandling.escalationCount > 2 && (
          <DetailField
            label="First Escalation Sent On"
            value={`${new Date(
              weaponHandling.firstEscalationSentOn,
            ).toDateString()}, ${new Date(
              weaponHandling.firstEscalationSentOn,
            ).toLocaleTimeString()}`}
          />
        )}

        {weaponHandling.escalationCount > 3 && (
          <DetailField
            label="Last Escalation Sent On"
            value={`${new Date(
              weaponHandling.secondEscalationSentOn,
            ).toDateString()}, ${new Date(
              weaponHandling.secondEscalationSentOn,
            ).toLocaleTimeString()}`}
          />
        )}
      </DetailSection>
    </div>
  );
};
