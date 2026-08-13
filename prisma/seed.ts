import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RailSutra Demo Database...');

  // Clean existing tables
  await prisma.train.deleteMany();
  await prisma.section.deleteMany();
  await prisma.corridor.deleteMany();
  await prisma.station.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users (Demo Roles)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'usr_controller',
        name: 'Rajesh Sharma',
        email: 'controller@railsutra.in',
        role: 'CONTROLLER',
      },
    }),
    prisma.user.create({
      data: {
        id: 'usr_planner',
        name: 'Priya Verma',
        email: 'planner@railsutra.in',
        role: 'PLANNER',
      },
    }),
    prisma.user.create({
      data: {
        id: 'usr_maintenance',
        name: 'Amit Patel',
        email: 'maintenance@railsutra.in',
        role: 'MAINTENANCE',
      },
    }),
    prisma.user.create({
      data: {
        id: 'usr_executive',
        name: 'Vikramaditya Singh',
        email: 'executive@railsutra.in',
        role: 'EXECUTIVE',
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} demo users`);

  // 2. Seed Stations (Major Indian Railway Nodes)
  const ndls = await prisma.station.create({
    data: {
      id: 'stn_ndls',
      code: 'NDLS',
      name: 'New Delhi',
      latitude: 28.6424,
      longitude: 77.2195,
      zone: 'NR',
      capacityTracks: 16,
    },
  });

  const cnb = await prisma.station.create({
    data: {
      id: 'stn_cnb',
      code: 'CNB',
      name: 'Kanpur Central',
      latitude: 26.4542,
      longitude: 80.3507,
      zone: 'NCR',
      capacityTracks: 10,
    },
  });

  const pryj = await prisma.station.create({
    data: {
      id: 'stn_pryj',
      code: 'PRYJ',
      name: 'Prayagraj Junction',
      latitude: 25.4452,
      longitude: 81.8315,
      zone: 'NCR',
      capacityTracks: 10,
    },
  });

  const ddu = await prisma.station.create({
    data: {
      id: 'stn_ddu',
      code: 'DDU',
      name: 'Pt. Deen Dayal Upadhyaya Jn',
      latitude: 25.2818,
      longitude: 83.1205,
      zone: 'ECR',
      capacityTracks: 12,
    },
  });

  const hwh = await prisma.station.create({
    data: {
      id: 'stn_hwh',
      code: 'HWH',
      name: 'Howrah Junction',
      latitude: 22.5840,
      longitude: 88.3426,
      zone: 'ER',
      capacityTracks: 23,
    },
  });

  const mmct = await prisma.station.create({
    data: {
      id: 'stn_mmct',
      code: 'MMCT',
      name: 'Mumbai Central',
      latitude: 18.9696,
      longitude: 72.8193,
      zone: 'WR',
      capacityTracks: 9,
    },
  });

  const adi = await prisma.station.create({
    data: {
      id: 'stn_adi',
      code: 'ADI',
      name: 'Ahmedabad Junction',
      latitude: 23.0225,
      longitude: 72.6012,
      zone: 'WR',
      capacityTracks: 12,
    },
  });

  console.log(`✅ Created 7 major stations`);

  // 3. Seed Corridors
  const corridorDelhiHowrah = await prisma.corridor.create({
    data: {
      id: 'cor_ndls_hwh',
      code: 'COR_NDLS_HWH',
      name: 'Delhi–Howrah Main Trunk Corridor',
      originStationId: ndls.id,
      destinationStationId: hwh.id,
      totalLengthKm: 1447.0,
      maxCapacityTrains: 120,
    },
  });

  const corridorMumbaiDelhi = await prisma.corridor.create({
    data: {
      id: 'cor_mmct_ndls',
      code: 'COR_MMCT_NDLS',
      name: 'Mumbai–Delhi Western Trunk Corridor',
      originStationId: mmct.id,
      destinationStationId: ndls.id,
      totalLengthKm: 1386.0,
      maxCapacityTrains: 110,
    },
  });

  console.log(`✅ Created 2 high-density corridors`);

  // 4. Seed Sections
  const sections = await Promise.all([
    prisma.section.create({
      data: {
        id: 'sec_ndls_cnb',
        corridorId: corridorDelhiHowrah.id,
        startStationId: ndls.id,
        endStationId: cnb.id,
        name: 'New Delhi – Kanpur Central Section',
        trackCount: 2,
        designSpeedKmh: 130,
        maxDailyCapacity: 85,
      },
    }),
    prisma.section.create({
      data: {
        id: 'sec_cnb_pryj',
        corridorId: corridorDelhiHowrah.id,
        startStationId: cnb.id,
        endStationId: pryj.id,
        name: 'Kanpur Central – Prayagraj Jn Section',
        trackCount: 2,
        designSpeedKmh: 130,
        maxDailyCapacity: 90,
      },
    }),
    prisma.section.create({
      data: {
        id: 'sec_pryj_ddu',
        corridorId: corridorDelhiHowrah.id,
        startStationId: pryj.id,
        endStationId: ddu.id,
        name: 'Prayagraj Jn – Pt DD Upadhyaya Section',
        trackCount: 2,
        designSpeedKmh: 130,
        maxDailyCapacity: 80,
      },
    }),
    prisma.section.create({
      data: {
        id: 'sec_ddu_hwh',
        corridorId: corridorDelhiHowrah.id,
        startStationId: ddu.id,
        endStationId: hwh.id,
        name: 'Pt DD Upadhyaya – Howrah Jn Section',
        trackCount: 2,
        designSpeedKmh: 130,
        maxDailyCapacity: 100,
      },
    }),
    prisma.section.create({
      data: {
        id: 'sec_mmct_adi',
        corridorId: corridorMumbaiDelhi.id,
        startStationId: mmct.id,
        endStationId: adi.id,
        name: 'Mumbai Central – Ahmedabad Jn Section',
        trackCount: 2,
        designSpeedKmh: 130,
        maxDailyCapacity: 75,
      },
    }),
    prisma.section.create({
      data: {
        id: 'sec_adi_ndls',
        corridorId: corridorMumbaiDelhi.id,
        startStationId: adi.id,
        endStationId: ndls.id,
        name: 'Ahmedabad Jn – New Delhi Section',
        trackCount: 2,
        designSpeedKmh: 110,
        maxDailyCapacity: 70,
      },
    }),
  ]);

  console.log(`✅ Created ${sections.length} corridor sections`);

  // 5. Seed Trains
  const trains = await Promise.all([
    prisma.train.create({
      data: {
        id: 'trn_12301',
        number: '12301',
        name: 'Howrah Rajdhani Express',
        type: 'SUPERFAST',
        totalCoaches: 22,
        maxSpeedKmh: 130,
      },
    }),
    prisma.train.create({
      data: {
        id: 'trn_12951',
        number: '12951',
        name: 'Mumbai Rajdhani Express',
        type: 'SUPERFAST',
        totalCoaches: 22,
        maxSpeedKmh: 130,
      },
    }),
    prisma.train.create({
      data: {
        id: 'trn_22436',
        number: '22436',
        name: 'Vande Bharat Express (Varanasi–NDLS)',
        type: 'SUPERFAST',
        totalCoaches: 16,
        maxSpeedKmh: 160,
      },
    }),
    prisma.train.create({
      data: {
        id: 'trn_12801',
        number: '12801',
        name: 'Purushottam Express',
        type: 'EXPRESS',
        totalCoaches: 24,
        maxSpeedKmh: 110,
      },
    }),
    prisma.train.create({
      data: {
        id: 'trn_12260',
        number: '12260',
        name: 'Sealdah Duronto Express',
        type: 'SUPERFAST',
        totalCoaches: 20,
        maxSpeedKmh: 130,
      },
    }),
    prisma.train.create({
      data: {
        id: 'trn_freight_4021',
        number: 'FREIGHT-4021',
        name: 'Coal Freight Rake #4021',
        type: 'FREIGHT',
        totalCoaches: 58,
        maxSpeedKmh: 75,
      },
    }),
  ]);

  console.log(`✅ Created ${trains.length} simulated train services`);
  console.log('🎉 RailSutra Demo Data Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
