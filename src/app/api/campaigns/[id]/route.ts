import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const client = await clientPromise;
//     const db = client.db('campaign-db');

//     const { id } = req.query;
//     if (typeof id !== 'string') {
//         res.status(400).json({ error: 'Invalid ID' });
//         return;
//     }


//     switch (req.method) {
//         case 'PUT':
//             const updatedCampaign = await db.collection('campaigns').findOneAndUpdate(
//                 { _id: new ObjectId(id as string) },
//                 { $set: req.body },
//                 { returnDocument: 'after' }
//             );

//             if (updatedCampaign === null || updatedCampaign.value === null) {
//                 res.status(404).json({ error: 'Campaign not found' });
//             } else {
//                 res.json(updatedCampaign.value);
//             }
//             break;

//         default:
//             res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

async function getClient(): Promise<MongoClient> {
    const client = await clientPromise;
    if (!(client instanceof MongoClient)) {
        throw new Error("Failed to establish database connection");
    }
    return client;
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const client = await getClient();
      const db = client.db('campaign-db');
      const body = await request.json();

      const { _id, ...updateData } = body;
      
      const result = await db.collection('campaigns').findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
  
      if (!result) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      }
  
      return NextResponse.json(result);
    } catch (e) {
      console.error("Failed to update campaign", e);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }