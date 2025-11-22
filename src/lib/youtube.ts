export type YouTubeVideo = {
  videoId: string
  title: string
  thumbnail: {
    url: string
    width: number
    height: number
  }[]
  lengthText?: string
  channelTitle?: string
}

export async function fetchYoutubeVideos(query: string): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos')
    }

    const data = await response.json()
    return data.videos || []
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return []
  }
}
