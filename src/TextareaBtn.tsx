import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { useState, useEffect } from 'react';

export function TextareaBtn() {
    const [text, setText] = useState<string>("");
    const [audioSrc, setAudioSrc] = useState<string>("");
    const [voice ,  setVoice] = useState<string>("Joanna");
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const websocket = new WebSocket('wss://coldvs51t5.execute-api.us-east-1.amazonaws.com/production/');
        websocket.onopen = () => console.log('Websocket Connected!');
        websocket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data) as { audioContent?: string; error?: string };
            if (data.audioContent) {
                setAudioSrc(`data:audio/mp3;base64,${data.audioContent}`);
            } else if (data.error) {
                console.error(data.error);
            }
        };
        websocket.onerror = (error: Event) => console.error('WebSocket error:', error);
        websocket.onclose = () => console.log('Disconnected');
        setWs(websocket);

        return () => websocket.close();
    }, []);

    const sendMessage = () => {
        if (ws && text) {
            ws.send(JSON.stringify({
                action: 'sendmessage',
                text: text,
                voiceId: voice
            }));
            setText('');
        }
    };

    return (
        <div className="grid w-full gap-2">
           <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="p-2 border rounded-md"
            >
                <option value="Joanna">Joanna</option>
                <option value="Matthew">Matthew</option>
            </select>
            <Textarea
                placeholder="Type your message here."
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
            <Button onClick={sendMessage}>Send message</Button>

            {audioSrc && (
                <audio src={audioSrc} autoPlay>
                    Your browser does not support audio. Oops!
                </audio>
            )}
        </div>
    );
}