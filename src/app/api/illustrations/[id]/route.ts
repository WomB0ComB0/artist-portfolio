import { createServer } from '@/utils';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (req.headers.get('NEXT_PUBLIC_API_KEY') !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const supabase = await createServer();
  const { data, error } = await supabase.from('image_uploads').select('*').eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}
