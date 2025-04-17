"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EmbedCode({ userId }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const [customization, setCustomization] = useState({
    title: "AI Assistant",
    primaryColor: "#0f172a",
    position: "right",
  })

  const scriptCode = `<script src="https://edurag-chatbot.vercel.app/embed.js" data-user-id="${userId}" data-title="${customization.title}" data-color="${customization.primaryColor}" data-position="${customization.position}"></script>`

  const iframeCode = `<iframe src="https://edurag-chatbot.vercel.app/embed/${userId}" width="100%" height="600px" frameborder="0"></iframe>`

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Your Chatbot</CardTitle>
        <CardDescription>Choose how you want to embed your chatbot on your website.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="widget">
          <TabsList className="mb-4">
            <TabsTrigger value="widget">Chat Widget</TabsTrigger>
            <TabsTrigger value="iframe">Iframe</TabsTrigger>
          </TabsList>
          <TabsContent value="widget" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Widget Title</Label>
                <Input
                  id="title"
                  value={customization.title}
                  onChange={(e) => setCustomization({ ...customization, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    value={customization.primaryColor}
                    onChange={(e) =>
                      setCustomization({
                        ...customization,
                        primaryColor: e.target.value,
                      })
                    }
                  />
                  <div
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: customization.primaryColor }}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Widget Position</Label>
                <select
                  id="position"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={customization.position}
                  onChange={(e) =>
                    setCustomization({
                      ...customization,
                      position: e.target.value,
                    })
                  }
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">{scriptCode}</pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(scriptCode)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="iframe" className="space-y-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">{iframeCode}</pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(iframeCode)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
