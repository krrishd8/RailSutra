import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stations = await prisma.station.findMany();
    const corridors = await prisma.corridor.findMany({
      include: {
        originStation: true,
        destinationStation: true,
        sections: true,
      },
    });

    return NextResponse.json({
      status: 'success',
      stationsCount: stations.length,
      corridorsCount: corridors.length,
      stations,
      corridors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch map corridors from database' },
      { status: 500 }
    );
  }
}
