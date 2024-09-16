import { create } from 'zustand';

interface BreweryType {
    id: string;
    producer_id: string;
    created_at: string;
    name: string;
    foundation_year: number;
    history: string;
    description: string;
    logo: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    website: string;
    rrss_ig: string;
    rrss_fb: string;
    rrss_linkedin: string;
    types_of_beers_produced: string[];
    special_processing_methods: string[];
    guided_tours: string;
    is_brewery_dirty: boolean;
}

interface BreweryState {
    brewery: BreweryType;
    assignBrewery: (brewery: BreweryType) => void;
    onChangeBrewery: (key: string, value: string | number) => void;
    clear: () => void;
    isEditShowModal: boolean;
    isDeleteShowModal: boolean;
    handleEditShowModal: (value: boolean) => void;
    handleDeleteShowModal: (value: boolean) => void;
}

const useBreweryStore = create<BreweryState>((set, get) => {
    let initialState = {
        brewery: {
            id: '',
            producer_id: '',
            created_at: '',
            name: '',
            foundation_year: 0,
            history: '',
            description: '',
            logo: '',
            country: '',
            region: '',
            sub_region: '',
            city: '',
            website: '',
            rrss_ig: '',
            rrss_fb: '',
            rrss_linkedin: '',
            types_of_beers_produced: [],
            special_processing_methods: [],
            guided_tours: '',
            is_brewery_dirty: false,
        },
        isEditShowModal: false,
        isDeleteShowModal: false,
    };

    return {
        ...initialState,
        assignBrewery: (brewery: BreweryType) => {
            set(() => ({ brewery }));
        },
        onChangeBrewery: (key: string, value: string | number) => {
            set((state) => {
                const { brewery } = state;
                return {
                    brewery: { ...brewery, [key]: value },
                };
            });
        },
        clear: () => {
            set(() => initialState);
        },
        handleEditShowModal: (value: boolean) => {
            set(() => ({ isEditShowModal: value }));
        },
        handleDeleteShowModal: (value: boolean) => {
            set(() => ({ isDeleteShowModal: value }));
        },
    };
});

export default useBreweryStore;
