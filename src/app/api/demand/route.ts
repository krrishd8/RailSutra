import { NextRequest, NextResponse } from 'next/server';
import { getSimulationEngine } from '@/modules/simulation/simulation.engine';
import { generateDemandForecast } from '@/modules/demand/demand.forecaster';
import { FestivalSeason } from '@/modules/demand/demand.types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const seasonParam = searchParams.get('season')?.toUpperCase() as FestivalSeason | null;

  const validSeasons: FestivalSeason[] = [
    'DURGA_PUJA',
    'CHHATH_PUJA',
    'DIWALI',
    'SUMMER_RUSH',
    'REGULAR',
  ];

  const season: FestivalSeason =
    seasonParam && validSeasons.includes(seasonParam) ? seasonParam : 'DURGA_PUJA';

  const engine = getSimulationEngine();
  const state = engine.getState();
  const forecast = generateDemandForecast(state, season);

  return NextResponse.json({
    status: 'success',
    data: forecast,
  });
}
