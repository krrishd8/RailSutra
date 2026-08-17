import { NextRequest, NextResponse } from 'next/server';
import { acknowledgeAlert } from '@/modules/alerts/alert.evaluator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { alertId } = body;

    if (!alertId || typeof alertId !== 'string') {
      return NextResponse.json(
        { status: 'error', message: 'alertId is required and must be a string' },
        { status: 400 }
      );
    }

    acknowledgeAlert(alertId);

    return NextResponse.json({
      status: 'success',
      message: `Alert ${alertId} acknowledged successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to acknowledge alert' },
      { status: 500 }
    );
  }
}
