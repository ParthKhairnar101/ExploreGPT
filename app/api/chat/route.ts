import { Message } from "@/core/types/types";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    const body = await request.text();
    const bodyJSON = JSON.parse(body);

    const messages: Message[] = [];

    const newMessage: Message = {
        role: "system",
        content: "You are an excellent event planner who can help suggest places for people to visit or check out. Ask people for 3 pieces of information: 1) The name of the place 2) If they like quiet or lively places 3) The date period when they will be going."
    };
    messages.push(newMessage);

    const conversation: Message[] = bodyJSON.conversation;
    conversation.forEach((converse: Message) => {
        messages.push(converse);
    });

    const bodyToSend = {
        "model": "gpt-3.5-turbo-0301",
        "temperature": 0.7,
        "messages": messages
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions",{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer " + process.env.OPENAI_API_KEY
        },
        body: JSON.stringify(bodyToSend)
    });

    const json = await response.json();
    let returnMsg: string = "";

    if (json.choices != null) {   
        const responseMessage = json.choices[0].message.content;
        returnMsg = responseMessage;
    }
    return new Response(returnMsg);
}
