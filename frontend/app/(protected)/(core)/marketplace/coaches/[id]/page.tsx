// import { COACHES } from '@/data/coaches'

// export default function CoachDetails({
//     params,
// }: {
//     params: { id: string }
// }) {
//     const coach = COACHES.find(c => c.id === params.id)
//     if (!coach) return null

//     return (
//         <div className="max-w-4xl mx-auto p-8 space-y-4">
//             <h1 className="text-3xl font-bold">{coach.name}</h1>
//             <p>{coach.bio}</p>

//             <div>
//                 <h3 className="font-semibold">Certifications</h3>
//                 <ul className="list-disc pl-6">
//                     {coach.certifications.map(cert => (
//                         <li key={cert}>{cert}</li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     )
// }
