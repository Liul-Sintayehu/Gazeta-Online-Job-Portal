import { Input } from '@/components/ui/input';
import { AlertStatusTypeMapping, FlightQueryParams } from '../types';
import { FilterSelect } from '../../common/FilterSelect';
import { Label } from '@/components/ui/label';

export default function ReportTableFilterInputs({
  queryParams,
  handleFilterChange,
}: {
  queryParams: FlightQueryParams;
  handleFilterChange: (filter: Partial<FlightQueryParams>) => void;
}) {
  return (
    <div className="">
      <div className="my-4 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 w-[245px]">
          <Label htmlFor="isAssigned">Assign Time</Label>
          <div className="w-full flex-1">
            <FilterSelect
              data={[
                { label: 'All', value: '0' },
                ...Object.entries(AlertStatusTypeMapping).map(
                  ([key, value]) => ({
                    label: value,
                    value: `${key}`,
                  }),
                ),
              ]}
              title="Assignment Time"
              name=""
              selectedItem={
                queryParams.assignedStatus
                  ? `${queryParams.assignedStatus}`
                  : '0'
              }
              onSelectChange={value => {
                if (value == '0')
                  handleFilterChange({
                    assignedStatus: undefined,
                  });
                else
                  handleFilterChange({
                    assignedStatus: Number(value) || undefined,
                  });
              }}
            />
          </div>
        </div>
        <div className="flex items-center">
          <span
            style={{
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
            className="text-sm rounded-l-md p-2 bg-green-700 text-white"
          >
            ET
          </span>
          <Input
            type="text"
            placeholder="Flight Number"
            value={queryParams.flightNumber || ''}
            onChange={e => handleFilterChange({ flightNumber: e.target.value })}
            className={` placeholder:text-gray-500 border focus:border-green-600 rounded-l-none ${
              queryParams.flightNumber ? 'border-green-600 uppercase' : ''
            }`}
          />
        </div>

        <Input
          type="text"
          placeholder="From"
          value={queryParams.departureStation || ''}
          onChange={e =>
            handleFilterChange({ departureStation: e.target.value })
          }
          className={` placeholder:text-gray-500 border focus:border-green-600 ${
            queryParams.departureStation ? 'border-green-600 uppercase' : ''
          }`}
        />

        <Input
          type="text"
          placeholder="To"
          value={queryParams.arrivalStation || ''}
          onChange={e => handleFilterChange({ arrivalStation: e.target.value })}
          className={` placeholder:text-gray-500 border focus:border-green-600 ${
            queryParams.arrivalStation ? 'border-green-600 uppercase' : ''
          }`}
        />

        <Input
          type="text"
          placeholder="Tail"
          value={queryParams.airCraftRegistration || ''}
          onChange={e =>
            handleFilterChange({ airCraftRegistration: e.target.value })
          }
          className={` placeholder:text-gray-500 border focus:border-green-600 ${
            queryParams.airCraftRegistration ? 'border-green-600 uppercase' : ''
          }`}
        />

        <Input
          type="text"
          placeholder="Tag Number"
          value={queryParams.tagNumber || ''}
          onChange={e => handleFilterChange({ tagNumber: e.target.value })}
          className={` placeholder:text-gray-500 border focus:border-green-600 ${
            queryParams.tagNumber ? 'border-green-600 uppercase' : ''
          }`}
        />
      </div>
    </div>
  );
}
