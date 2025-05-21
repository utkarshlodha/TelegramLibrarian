'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface Post {
  id: string
  title: string
  text: string
  similarity: number
}

export default function Home() {
  const [question, setQuestion] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const togglePost = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
      }

      const { results: searchResults } = await res.json()
      setResults(searchResults || [])
      setExpandedPosts(new Set())
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="question" className="text-2xl font-bold">
           I share Satya ji's posts based on your question 🫶
        </Label>
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What is true peace?"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {results.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <h2 className="font-bold text-lg mb-1">{post.title}</h2>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {expandedPosts.has(post.id) 
                    ? post.text 
                    : post.text.slice(0, 300) + (post.text.length > 300 ? '...' : '')}
                </p>
                {post.text.length > 300 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePost(post.id)}
                    className="text-xs"
                  >
                    {expandedPosts.has(post.id) ? 'Show less' : 'Read more'}
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  Similarity: {(post.similarity * 100).toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
