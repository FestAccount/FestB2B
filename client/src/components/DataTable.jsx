import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DataTable = ({ submissions }) => {
  return (
    <div className="mt-8 bg-black/80 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {submission.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {submission.prenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {submission.email}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  <div className="max-w-xs truncate">
                    {submission.message}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                  {format(new Date(submission.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
