import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.RAPIDAPI_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://yt-api.p.rapidapi.com/search?q=${encodeURIComponent(query)}&gl=BR&hl=pt`,
      {
        headers: {
          'x-rapidapi-host': 'yt-api.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    // Filtrar apenas vídeos
    const videos = data.data?.filter((item: any) => item.type === 'video') || []

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
