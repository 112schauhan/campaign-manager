"use client";

import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import CampaignList from '../components/CampaignList';
import CampaignForm from '../components/CampaignForm';
import { Campaign } from '../types/campaignTypes';
import { CustomButton } from '@/components/button/Button';

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  useEffect(() => {
    fetchCampaigns();
  }, [showCreateForm]);

  const fetchCampaigns = async () => {
    const response = await axios.get('/api/campaigns');

    setCampaigns(response.data);
  };

  const handleSubmit = async (campaign: Campaign) => {
    if (editingCampaign) {
      await axios.put(`/api/campaigns/${editingCampaign._id}`, campaign);
    } else {
      await axios.post('/api/campaigns/', campaign);
    }
    fetchCampaigns();
    setEditingCampaign(null);
  };

  const handleCreateCampaignModal = () => {
    setShowCreateForm(true);
  }

  const closeCampaignModal = () => {
    setShowCreateForm(false);
  }

  return (
    <Fragment>
      {
        showCreateForm && <CampaignForm campaign={editingCampaign || undefined} onSubmit={handleSubmit} onClose={closeCampaignModal} />
      }
      <div className='main'>
        <h1 className='campaignTitle'>Campaign Manager</h1>
        <CampaignList campaigns={campaigns} onEdit={setEditingCampaign} fetchCampaigns={fetchCampaigns}/>

        <CustomButton onClick={handleCreateCampaignModal}>Create Campaign</CustomButton>

      </div>
    </Fragment>
  );
};

export default Home;