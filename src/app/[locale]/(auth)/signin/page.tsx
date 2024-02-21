import { redirect } from 'next/navigation';
import readUserSession from '../../../../lib/actions';
import SignIn from './SignIn';

export default async function SignInPage() {
  const session = await readUserSession();

  if (session) {
    redirect('/es');
  }

  return <SignIn />;
}
