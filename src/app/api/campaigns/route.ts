import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { MongoClient } from 'mongodb';

async function getClient(): Promise<MongoClient> {
  const client = await clientPromise;
  if (!(client instanceof MongoClient)) {
    throw new Error("Failed to establish database connection");
  }
  return client;
}

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db('campaign-db');
    const campaigns = await db.collection('campaigns').find({}).toArray();
    return NextResponse.json(campaigns);
  } catch (e) {
    console.error("Failed to fetch campaigns", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await getClient();
    const db = client.db('campaign-db');
    const body = await request.json();
    
    const newCampaign = await db.collection('campaigns').insertOne(body);
    return NextResponse.json(newCampaign);
  } catch (e) {
    console.error("Failed to create campaign", e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}