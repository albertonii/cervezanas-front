import { IBrewery } from '@/lib/types/types';
import { create } from 'zustand';

interface BreweryState {
    brewery: IBrewery;
    assignBrewery: (brewery: IBrewery) => void;
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
            created_at: '',
            name: '',
            foundation_year: 1900,
            history: '',
            description: '',
            logo: '',
            address: '',
            city: '',
            sub_region: '',
            region: '',
            country: '',
            website: '',
            rrss_ig: '',
            rrss_fb: '',
            rrss_linkedin: '',
            types_of_beers_produced: [],
            special_processing_methods: [],
            guided_tours: '',
            producer_id: '',
        },
        isEditShowModal: false,
        isDeleteShowModal: false,
    };

    return {
        ...initialState,
        assignBrewery: (brewery: IBrewery) => {
            set(() => ({ brewery }));
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
