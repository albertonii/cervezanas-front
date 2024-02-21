import { redirect } from 'next/navigation';
import readUserSession from '../../../../lib/actions';

export default async function Unauthenticated() {
  const session = await readUserSession();

  if (session) {
    redirect('/');
  }

  return (
    <div>
      <h1>Accede con tu usuario para poder ver esta sección</h1>
    </div>
  );
}
