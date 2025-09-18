import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";


export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold font-headline">Settings</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Text-to-Speech</CardTitle>
                    <CardDescription>Configure voice output settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tts-enabled">Enable TTS</Label>
                        <Switch id="tts-enabled" />
                    </div>
                     <p className="text-sm text-muted-foreground">More TTS controls (speed, pitch) coming soon.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Privacy</CardTitle>
                    <CardDescription>Manage your data and privacy settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="telemetry">Enable Anonymous Analytics</Label>
                        <Switch id="telemetry" />
                    </div>
                    <p className="text-sm text-muted-foreground">We respect your privacy. All conversation data is stored locally on your device by default.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cache Management</CardTitle>
                    <CardDescription>Clear cached data to free up space.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Button variant="outline">Clear Wiki Cache</Button>
                    <Button variant="outline">Clear Media Cache</Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
