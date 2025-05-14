import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const { userMessage } = await req.json();

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'deepseek/deepseek-r1:free',
                messages: [{ role: 'user', content: userMessage }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'https://www.sitename.com',  // Replace with your site name
                    'X-Title': 'SiteName',                       // Replace with your site title
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = response.data;
        const markdownText =
            data.choices?.[0]?.message?.content || 'No response received.';

        return NextResponse.json({ reply: markdownText });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Error communicating with AI' },
            { status: 500 }
        );
    }
}
