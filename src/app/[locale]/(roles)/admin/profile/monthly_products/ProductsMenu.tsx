'use client';

import React, { useEffect, useState } from 'react';
import { IMonthlyProduct, IProduct } from '@/lib//types/types';
import MonthlyProductsList from './MonthlyProductsList';
import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';

interface Props {
    products: IProduct[];
    mProducts: IMonthlyProduct[];
}

export default function ProductsMenu({ products, mProducts }: Props) {
    const [menuOption, setMenuOption] = useState<string>('monthly_products');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const renderSwitch = () => {
        if (isLoading) return <div>Loading...</div>;

        switch (menuOption) {
            case 'monthly_products':
                return (
                    <MonthlyProductsList
                        mProducts={mProducts}
                        products={products}
                    />
                );
        }
    };

    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    // useEffect(() => {
    //   if (month === 0 && year === 0) {
    //     const fetchByMonthAndYear = async () => {
    //       const { data, error } = await supabase.from("monthly_products").select(
    //         `
    //           id,
    //           category,
    //           month,
    //           year          `
    //       );

    //       if (error) throw error;

    //       const mProducts = data as IMonthlyProduct[];
    //       setProducts(mProducts);
    //     };

    //     fetchByMonthAndYear();
    //   }

    //   if (month > 0 && year === 0) {
    //     const fetchByMonthAndYear = async () => {
    //       const { data, error } = await supabase
    //         .from("monthly_products")
    //         .select(
    //           `
    //             id,
    //             category,
    //             month,
    //             year
    //           `
    //         )
    //         .eq("month", month);

    //       if (error) throw error;

    //       const mProducts = data as IMonthlyProduct[];
    //       setProducts(mProducts);
    //     };

    //     fetchByMonthAndYear();
    //   }

    //   if (month === 0 && year > 0) {
    //     const fetchByMonthAndYear = async () => {
    //       const { data, error } = await supabase
    //         .from("monthly_products")
    //         .select(
    //           `
    //             id,
    //             category,
    //             month,
    //             year
    //           `
    //         )
    //         .eq("year", year);

    //       if (error) throw error;

    //       const mProducts = data as IMonthlyProduct[];
    //       setProducts(mProducts);
    //     };

    //     fetchByMonthAndYear();
    //   }

    //   if (month > 0 && year > 0) {
    //     const fetchByMonthAndYear = async () => {
    //       const { data, error } = await supabase
    //         .from("monthly_products")
    //         .select(
    //           `
    //             id,
    //             category,
    //             month,
    //             year
    //           `
    //         )
    //         .eq("month", month)
    //         .eq("year", year);

    //       if (error) throw error;

    //       const mProducts = data as IMonthlyProduct[];
    //       setProducts(mProducts);
    //     };

    //     fetchByMonthAndYear();
    //   }
    // }, [month, year]);

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={['monthly_products']}
            />

            {renderSwitch()}
        </>
    );
}
