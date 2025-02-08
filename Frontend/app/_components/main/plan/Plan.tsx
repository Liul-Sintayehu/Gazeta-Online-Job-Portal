import { CardContent, CardTitle } from "@/components/ui/card";
import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import PlanLists from "./PlanLists";
import { Button } from "@/components/ui/button";
import EditPlanDialog from "./EditPlanDialog";
import DeletePlanDialog from "./DeletePlanDialog";

export default function Plan(){
    return  <Card className="border rounded-xl shadow border-purple-200">
                <CardHeader>
                <CardTitle className="flex gap-4 text-sm font-medium font-poppins">
                    <span>Monday</span>
                </CardTitle>
                </CardHeader>
                <CardContent>
                 <PlanLists data={[]}/>
                </CardContent>
                <CardFooter className="gap-3 flex justify-end">
                    <EditPlanDialog/>
                    <DeletePlanDialog/>
                 </CardFooter>
  </Card>
}