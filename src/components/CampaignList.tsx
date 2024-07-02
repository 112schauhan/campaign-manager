import React, { Fragment, useEffect, useState } from 'react';
import { Campaign, CampaignListProps, OptionType } from '../types/campaignTypes';
import DatePicker from 'react-datepicker';
import { CustomSelect } from './multiSelect/MultiSelect';
import { generateTimeSlots } from '@/utils/generateTime';
import { MultiValue, SingleValue } from 'react-select';
import axios from 'axios';
import { getNextActivation } from '@/utils/campaignUtils';
import { getWeekdayOptions } from '@/utils/dateUtils';
import { CustomButton } from './button/Button';

const CampaignList: React.FC<CampaignListProps> = ({ campaigns, onEdit, fetchCampaigns }) => {
    const [editingCampaign, setEditingCampaign] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Campaign | null>(null);
    const [weekdayOptions, setWeekdayOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        const options = getWeekdayOptions(editForm?.startDate ?? null, editForm?.endDate ?? null);
        setWeekdayOptions(options);

        // Filter out any selected weekdays that are no longer in the options
    }, [editForm]);

    const formatDate = (date: Date | string | null): string => {
        if (!date) return 'N/A';
        const dateObject = date instanceof Date ? date : new Date(date);
        return dateObject.toLocaleDateString();
    };

    const handleEdit = (campaign: Campaign) => {
        setEditingCampaign(campaign._id ?? null);
        setEditForm(campaign);
    };

    const handleCancelEdit = () => {
        setEditingCampaign(null);
        setEditForm(null);
    };

    const handleInputChange = (field: keyof Campaign, value: any) => {
        if (editForm) {
            setEditForm({ ...editForm, [field]: value });
        }
    };

    const handleWeekdaysUpdate = (selectedOptions: MultiValue<OptionType>) => {
        if (editForm) {
            setEditForm({
                ...editForm,
                schedule: {
                    ...editForm.schedule,
                    weekdays: selectedOptions?.map(option => option.value)
                }
            });
        }
    };

    const handleTimeSlotChange = (index: number, field: 'startTime' | 'endTime', selectedOption: SingleValue<OptionType>) => {
        if (editForm && selectedOption) {
            const newTimeRange = [...editForm.schedule.timeRange];
            newTimeRange[index] = { ...newTimeRange[index], [field]: selectedOption.value };
            setEditForm({
                ...editForm,
                schedule: {
                    ...editForm.schedule,
                    timeRange: newTimeRange
                }
            });
        }
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editForm && editForm?._id) {
            try {
                const response = await axios.put(`/api/campaigns/${editForm._id}`, editForm, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    onEdit(editForm);
                    handleCancelEdit();
                    await fetchCampaigns();
                } else {
                    console.error('Failed to update campaign');
                }
            } catch (error) {
                console.error('Error updating campaign:', error);
            }
        }
    };

    const formatNextActivation = (campaign: Campaign): string => {
        const nextActivation = getNextActivation(campaign);
        if (!nextActivation) return 'No future activations';
        const splitResult = nextActivation.toLocaleString().split(',')
        const dateString = new Date(splitResult[0]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        })

        return dateString + ' at ' + splitResult[1]; // This will display both date and time
    };

    return (
        <div className='campaignMain'>
            {editingCampaign !== null && <Fragment>
                <div className='backdrop' onClick={handleCancelEdit}></div>
                <form onSubmit={handleSubmitEdit} className='campaignEditForm'>
                    <div className='campaignSection'>
                        <h4>Campaign Type</h4>
                        <select
                            value={editForm?.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className='dropdown'
                        >
                            <option value="Cost per Order">Cost per Order</option>
                            <option value="Cost per Click">Cost per Click</option>
                            <option value="Buy One Get One">Buy One Get One</option>
                        </select>
                    </div>
                    <div className='timeRangeContainer'>
                        <div className='campaignSection'>
                            <h4>Start Date</h4>
                            <DatePicker
                                selected={editForm?.startDate ? new Date(editForm.startDate) : null}
                                onChange={(date) => handleInputChange('startDate', date)}
                                dateFormat={'MMM dd yyyy'}
                            />
                        </div>
                        <div className='campaignSection'>
                            <h4>End Date</h4>

                            <DatePicker
                                selected={editForm?.endDate ? new Date(editForm.endDate) : null}
                                onChange={(date) => handleInputChange('endDate', date)}
                                dateFormat={'MMM dd yyyy'}
                            />
                        </div>
                    </div>
                    <div className='campaignSection'>
                        <h4>Select Days</h4>
                        <CustomSelect
                            options={weekdayOptions}
                            onChange={handleWeekdaysUpdate as (options: MultiValue<OptionType> | SingleValue<OptionType>) => void}
                            placeholder={'Select days'}
                            isMulti={true}
                        />
                    </div>
                    {editForm && editForm?.schedule?.timeRange?.map((slot, index) => (
                        <div key={index} className='timeRangeContainer'>
                            <div className='campaignSection'>
                                <h4>Start Time</h4>
                                <CustomSelect
                                    options={generateTimeSlots()}
                                    onChange={(selectedOption) => handleTimeSlotChange(index, 'startTime', selectedOption as SingleValue<OptionType>)}
                                    placeholder={'Select start time'}
                                    isMulti={false}
                                />
                            </div>
                            <div className='campaignSection'>
                                <h4>End Time</h4>
                                <CustomSelect
                                    options={generateTimeSlots()}
                                    onChange={(selectedOption) => handleTimeSlotChange(index, 'endTime', selectedOption as SingleValue<OptionType>)}
                                    placeholder={'Select end time'}
                                    isMulti={false}
                                />
                            </div>
                        </div>
                    ))}
                    <div className='formButtonContainer'>
                        <CustomButton type="submit">Save</CustomButton>
                        <CustomButton type="button" onClick={handleCancelEdit}>Cancel</CustomButton>
                    </div>
                </form>
            </Fragment>
            }
            <h2 className='campaignSubtitle'>Campaigns</h2>
            <div className='campaignsList'>
                {campaigns?.map((campaign) => (
                    <div key={campaign?._id} className='campaignContainer'>
                        {/* {editingCampaign === campaign._id ? (
                           
                        ) : (
                       
                        )} */}
                        <div className='campaignCard'>
                            <h2>{campaign?.type}</h2>
                            <div className='campaignDetail'>
                                <p className='campaignRange'>From {formatDate(campaign.startDate)} to {formatDate(campaign.endDate)}</p>
                                <p>Days:</p>
                                <ul className='daysList'>
                                    {
                                        campaign?.schedule?.weekdays?.map((item, index) => <li key={index}>{item}</li>)
                                    }
                                </ul>
                                <p>Time Slots</p>
                                {/* <p>Weekdays: {campaign?.schedule?.weekdays?.join(', ') ?? []}</p> */}
                                <ul className='daysList'>
                                    {
                                        campaign?.schedule?.timeRange?.map((slot, index) => <li key={index}>{`${slot.startTime} to ${slot.endTime}`}</li>)
                                    }
                                </ul>
                                {/* <p>Time Ranges: {campaign?.schedule?.timeRange?.map(slot => `${slot.startTime}-${slot.endTime}`)?.join(', ') ?? []}</p> */}
                                <p>Next Activation will be on  {formatNextActivation(campaign)}</p>
                            </div>
                            <CustomButton onClick={() => handleEdit(campaign)}>Edit</CustomButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampaignList;