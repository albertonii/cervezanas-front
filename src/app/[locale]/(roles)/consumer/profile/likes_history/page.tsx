import { redirect } from 'next/navigation';
import { VIEWS } from '../../../../../../constants';
import { ILike } from '../../../../../../lib/types';
import createServerClient from '../../../../../../utils/supabaseServer';
import readUserSession from '../../../../../../lib/actions';
import { LikesHistory } from './LikesHistory';

export default async function LikesPage() {
  const { likes } = await getLikesData();
  if (!likes) return null;

  return (
    <>
      <LikesHistory likes={likes} />
    </>
  );
}

async function getLikesData() {
  const supabase = await createServerClient();

  const session = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: likesData, error: likesError } = await supabase
    .from('likes')
    .select(
      `
        *
      `,
    )
    .eq('owner_id', session.id);

  if (likesError) throw likesError;

  return { likes: likesData as ILike[] };
}
