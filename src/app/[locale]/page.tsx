import Homepage from './Homepage';
import { IMonthlyProduct } from '@/lib/types/types';
import createServerClient from '@/utils/supabaseServer';

export const metadata = {
    title: { default: 'Comunidad Cervezanas', template: `%s | Cervezanas` },
    description: 'Tu portal de descubrimiento de cervezas artesanales',
};

export default async function Home() {
    const monthlyProducts = await getMonthlyProducts();

    return <Homepage monthlyProducts={monthlyProducts} />;
}

async function getMonthlyProducts() {
    const supabase = await createServerClient();

    const { data: monthlyProducts, error: monthlyProductsError } =
        await supabase.from('monthly_products').select(`
      product_id,
      created_at,
      category,
      month,
      year,
      products (
        *,
        product_multimedia (*),
        reviews (*),
        likes (*)
      )
    `);

    if (monthlyProductsError) throw monthlyProductsError;
    return monthlyProducts as IMonthlyProduct[];
}
