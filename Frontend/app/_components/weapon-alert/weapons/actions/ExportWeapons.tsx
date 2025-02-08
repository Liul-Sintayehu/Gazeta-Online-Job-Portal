import { Button } from '@/components/ui/button';
import { FileUp, LoaderCircle, Check } from 'lucide-react'; // Import Check icon
import React from 'react';
import { exportWeaponsList } from '@/app/_lib/data/weapon-alert';
import { toast } from 'sonner';
import { FetchParameter } from '../../types';

export default function ExportWeapons({
  params,
  hasData,
  isError,
}: {
  params: FetchParameter;
  hasData: boolean;
  isError: boolean;
}) {
  const [isLoading, setLoading] = React.useState(false);
  const [isSuccess, setSuccess] = React.useState(false);

  const handleExport = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const isDownloaded = await exportWeaponsList(params);
      if (isDownloaded === true) {
        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      toast.error('Failed to export weapons list!');
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={!hasData || isError || isLoading}>
      {isLoading ? (
        <LoaderCircle
          className="animate-spin mr-2 h-4 w-fit"
          strokeWidth={1.25}
        />
      ) : isSuccess ? (
        <Check className="mr-2 h-4 w-fit" />
      ) : (
        <FileUp className="mr-2 h-4 w-fit" />
      )}
      {isSuccess ? 'Exported' : 'Export'}
    </Button>
  );
}
