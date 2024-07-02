export type TimeRange = {
  startTime: string;
  endTime: string;
}

export interface Campaign {
  _id?: string;
  type: 'Cost per Order' | 'Cost per Click' | 'Buy One Get One';
  startDate: Date;
  endDate: Date;
  schedule: {
    weekdays: string[] | [];
    timeRange: TimeRange[] | [];
  };
}

export interface CampaignListProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  fetchCampaigns:()=>void;
}

export interface CampaignFormProps {
  campaign?: Campaign;
  onSubmit: (campaign: Campaign) => void;
  onClose:()=>void;
}

export type OptionType = { value: string; label: string };