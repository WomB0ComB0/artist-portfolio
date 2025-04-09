import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { createServer } from '@/utils';

export async function GET(req: NextRequest) {
  if (req.headers.get('NEXT_PUBLIC_API_KEY') !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortDirection = searchParams.get('sortDirection') || 'desc';
  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

  const supabase = await createServer();

  const query = supabase
    .from('image_uploads')
    .select('*', { count: 'exact' })
    .order(sortBy, { ascending: sortDirection === 'asc' })
    .range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: data,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function OPTIONS(_req: NextRequest) {
  return NextResponse.json({ message: 'GET, HEAD' }, { status: 200 });
}

export async function HEAD(_req: NextRequest) {
  return NextResponse.json({ message: 'HEAD request received' }, { status: 200 });
}
