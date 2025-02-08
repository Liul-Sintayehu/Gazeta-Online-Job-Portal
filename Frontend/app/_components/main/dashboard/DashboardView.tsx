import { CardContent, CardTitle } from "@/components/ui/card";
import { Card, CardHeader } from "@nextui-org/card";
import DashboardCard from "./DashboardCard";

export default function DashboardView(){
    var nums = [0,1,2,3];
    return <div>
        <div className="font-inter m-4 mt-8 grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] auto-rows-auto justify-center">
    {nums.map(num => (<DashboardCard title={num.toString() + "card"}/>))}
      </div>
      <hr></hr>
      <div className="font-inter m-4 mt-8 grid gap-4 grid-cols-[repeat(auto-fill,minmax(500px,1fr))] auto-rows-auto justify-center">
    {nums.map(num => (<DashboardCard title={num.toString() + "card"}/>))}
      </div>
      </div>
}