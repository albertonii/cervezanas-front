'use client';

import React from 'react';
import Spinner from '@/app/[locale]/components/common/Spinner';

export default function Loading() {
    return <Spinner color="beer-blonde" size="fullScreen" absolute />;
}
