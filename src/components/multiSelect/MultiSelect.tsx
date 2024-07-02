import { OptionType } from '@/types/campaignTypes';
import React, { useEffect, useState } from 'react'
import Select, { MultiValue, SingleValue } from 'react-select';

export const CustomSelect = ({ options, onChange, placeholder, isMulti = true }: {
    options: OptionType[];
    onChange: (options: MultiValue<OptionType> | SingleValue<OptionType>) => void;
    placeholder: string; isMulti?: boolean;
}) => {
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPortalTarget(document.body);
    }, []);

    return <Select styles={{
        control: (baseStyles, state) => ({
            ...baseStyles,
            minWidth: '209px',
            color: '#000000',
            cursor: 'pointer',
            width: '100%'
        }),
        container: () => ({
            width: '100%'
        }),
        option: () => ({
            color: '#000000',
            padding: '8px 16px',
            cursor: 'pointer'
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999
        })
    }}
        options={options} onChange={onChange}
        placeholder={placeholder}
        isMulti={isMulti}
        menuPortalTarget={portalTarget}
        menuPosition='fixed' />
}