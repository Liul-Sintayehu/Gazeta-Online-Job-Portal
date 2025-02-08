import { CardContent, CardTitle } from "@/components/ui/card";
import { Card, CardHeader } from "@nextui-org/card";
import Plan from "./Plan";
interface MyPlansProps{
    data: any[]
}

export default function MyPlans({data}:MyPlansProps){
    data.push(0)
    data.push(1)
    data.push(2)
    data.push(0)
    data.push(1)
    data.push(2)
    data.push(2)
    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-4 ">{data.map(item =>(<Plan/>))}

    </div>
}

  