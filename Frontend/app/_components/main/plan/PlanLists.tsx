interface PlanListsProps{
    data : any[]
}
export default function PlanLists({data}:PlanListsProps){
    data.push('shoulder')
    data.push('Triceps')
    data.push('Chest')
    return  <ul>
        {data.map(item => 
         <li>{item}</li> 
        )}
    </ul>
}