import { CardContent, CardTitle } from "@/components/ui/card";
import { Card, CardHeader } from "@nextui-org/card";
interface PLanTitle{
    title : string
}
export default function DashboardCard({title}: PLanTitle){
    return  <Card className="border">
                <CardHeader>
                <CardTitle className="flex gap-4 text-sm font-medium font-poppins">
                    <span>{title}</span>
                </CardTitle>
                </CardHeader>
                <CardContent>
                 content
                </CardContent>
  </Card>
}