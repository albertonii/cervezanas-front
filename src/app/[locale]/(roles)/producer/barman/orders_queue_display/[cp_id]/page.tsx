import { DisplayEventOrders } from './DisplayEventOrders';

export default async function Page({ params }: any) {
    const { cp_id } = params;

    return <DisplayEventOrders cpId={cp_id} />;
}
