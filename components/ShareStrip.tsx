'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Share2, MessageCircle, Send, Link, Check } from 'lucide-react'

interface ShareStripProps {
  url: string
  title?: string
  description?: string
}

export function ShareStrip({ url, title = 'Check out these movie recommendations', description }: ShareStripProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    text: description || 'I found some great movie recommendations!',
    url
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${shareData.text} ${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleTelegram = () => {
    const text = encodeURIComponent(`${shareData.text} ${url}`)
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
  }

  const handleMessenger = () => {
    const text = encodeURIComponent(`${shareData.text} ${url}`)
    window.open(`https://www.facebook.com/dialog/send?link=${url}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`, '_blank')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback to copy link
      handleCopyLink()
    }
  }

  return (
    <Card className="border-0 shadow-sm bg-muted/30">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Share these picks:</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* WhatsApp */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsApp}
              className="h-8 w-8 p-0"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            
            {/* Telegram */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleTelegram}
              className="h-8 w-8 p-0"
              title="Share on Telegram"
            >
              <Send className="w-4 h-4" />
            </Button>
            
            {/* Messenger */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleMessenger}
              className="h-8 w-8 p-0"
              title="Share on Messenger"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            
            {/* Copy Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 w-8 p-0"
              title="Copy link"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Link className="w-4 h-4" />
              )}
            </Button>
            
            {/* Native Share (mobile) */}
            {navigator.share && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNativeShare}
                className="h-8 px-3 text-xs"
              >
                Share
              </Button>
            )}
          </div>
        </div>
        
        {copied && (
          <div className="mt-2 text-center">
            <p className="text-xs text-green-600">Link copied to clipboard!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
