import '@fortawesome/fontawesome-svg-core/styles.css';
import EventBasket from './EventBasket';

interface Props {
    params: any;
}

export default async function EventBasketPage({ params }: Props) {
    const { id } = params;
    return <EventBasket eventId={id} />;
}
