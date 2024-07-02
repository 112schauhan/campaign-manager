import React, { Fragment, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Campaign, CampaignFormProps, OptionType } from '../types/campaignTypes';
import { CustomSelect } from './multiSelect/MultiSelect';
import { generateTimeSlots } from '@/utils/generateTime';
import { CustomButton } from './button/Button';
import { MultiValue, SingleValue } from 'react-select';
import { getWeekdayOptions } from '@/utils/dateUtils';

const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSubmit, onClose }) => {
    const [type, setType] = useState(campaign?.type || 'Cost per Order');
    const [startDate, setStartDate] = useState<Date | null>(campaign?.startDate || new Date());
    const [endDate, setEndDate] = useState<Date | null>(campaign?.endDate || new Date());
    const [schedule, setSchedule] = useState(campaign?.schedule || {});
    const [selectedWeekdays, setSelectedWeekdays] = useState<OptionType[]>([]);
    const [timeSlots, setTimeSlots] = useState<{ startTime: string; endTime: string }[]>([{ startTime: '', endTime: '' }]);
    const [weekdayOptions, setWeekdayOptions] = useState<OptionType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const options = getWeekdayOptions(startDate, endDate);
        setWeekdayOptions(options);

        // Filter out any selected weekdays that are no longer in the options
        setSelectedWeekdays(prev => prev.filter(day => options.some(option => option.value === day.value)));
    }, [startDate, endDate]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (error) {
            alert("Please fix the date error before submitting.");
            return;
        }
        if (!startDate || !endDate) {
            alert("Both start and end dates must be selected.");
            return;
        }

        const weekdaysSelection = selectedWeekdays.map((item) => item.value);
        const updatedTimeSlots = timeSlots?.filter((item) => {
            if (item?.startTime !== '' && item?.endTime !== '') return item
        });
        console.log('Append time slots ',);
        debugger;

        onSubmit({
            type, startDate, endDate, schedule: {
                weekdays: weekdaysSelection,
                timeRange: updatedTimeSlots,
            }
        } as Campaign);

        setTimeSlots([{ startTime: '', endTime: '' }]);
        setSelectedWeekdays([]);
        onClose();
    };

    const handleWeekdaysUpdate = (selectedOptions: MultiValue<OptionType>) => {
        setSelectedWeekdays(selectedOptions as OptionType[]);
    };

    const handleTimeSlotChange = (field: 'startTime' | 'endTime', selectedOption: SingleValue<OptionType>) => {
        if (selectedOption && timeSlots?.length > 0) {
            setTimeSlots(prevSlots => {
                const lastSlot = prevSlots[prevSlots.length - 1] || { startTime: '', endTime: '' };
                const updatedLastSlot = { ...lastSlot, [field]: selectedOption.value };

                // If both startTime and endTime are filled, append a new slot
                if (updatedLastSlot.startTime && updatedLastSlot.endTime) {
                    return [...prevSlots.slice(0, -1), updatedLastSlot, { startTime: '', endTime: '' }];
                } else {
                    return [...prevSlots.slice(0, -1), updatedLastSlot];
                }
            });
        }
    };

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setStartDate(date);
          
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            if (startDate && date <= startDate) {
                setError("End date must be after start date");
                alert('End date must be after start date');
            } else {
                setEndDate(date);
                setError(null);
            }
        }
    };

    return (
        <Fragment>
            <div className='backdrop' onClick={onClose}></div>
            <div className='formContainer'>
                <form onSubmit={handleSubmit} className='campaignForm'>
                    <div className='campaignSection'>
                        <h4>Campaign Type</h4>
                        <select value={type} onChange={(e) => setType(e.target.value as Campaign['type'])} className='dropdown'>
                            <option value="Cost per Order">Cost per Order</option>
                            <option value="Cost per Click">Cost per Click</option>
                            <option value="Buy One Get One">Buy One Get One</option>
                        </select>
                    </div>
                    <div className='timeRangeContainer'>
                        <div className='campaignSection'>
                            <h4>Start Date</h4>
                            <DatePicker
                                selected={startDate} onChange={(date: Date | null) => handleStartDateChange(date)} dateFormat={'MMM dd yyyy'} />
                        </div>
                        <div className='campaignSection'>
                            <h4>End Date</h4>
                            <DatePicker
                                selected={endDate} onChange={(date: Date | null) => handleEndDateChange(date)} dateFormat={'MMM dd yyyy'} />
                        </div>
                    </div>
                    <div className='campaignSection'>
                        <h4>Select Days</h4>
                        <CustomSelect options={weekdayOptions}
                            onChange={handleWeekdaysUpdate as (options: MultiValue<OptionType> | SingleValue<OptionType>) => void}
                            placeholder={'Select days'}
                        />
                    </div>

                    {timeSlots?.map((slot, index) => {
                        return <div key={index} className='timeRangeContainer'>
                            <div className='campaignSection'>
                                <h4>Start Time</h4>
                                <CustomSelect
                                    options={generateTimeSlots()}
                                    onChange={(selectedOption) => handleTimeSlotChange('startTime', selectedOption as SingleValue<OptionType>)}
                                    placeholder={'Select start time'}
                                    isMulti={false}
                                />
                            </div>
                            <div className='campaignSection'>
                                <h4>End Time</h4>
                                <CustomSelect
                                    options={generateTimeSlots()}
                                    onChange={(selectedOption) => handleTimeSlotChange('endTime', selectedOption as SingleValue<OptionType>)}
                                    placeholder={'Select end time'}
                                    isMulti={false}
                                />
                            </div>
                        </div>
                    })
                    }

                    <div className='formButtons'>
                        <CustomButton type="submit" disabled={timeSlots?.length === 1 && timeSlots[0]?.startTime === '' && timeSlots[0]?.endTime === '' ? true : false}>{campaign ? 'Update' : 'Create'} Campaign</CustomButton>
                        <CustomButton onClick={onClose}>Close</CustomButton>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default CampaignForm;