import json


def extract_response_text(messages):
    response_text = ""
    for message in messages:
        if message["role"] != "assistant":
            continue

        sender = message.get("sender", "Agent")
        content = message.get("content", "")
        tool_calls = message.get("tool_calls") or []

        if content:
            response_text += f"**{sender}:** {content}\n"

        for tool_call in tool_calls:
            f = tool_call["function"]
            name, args = f["name"], f["arguments"]
            arg_str = json.dumps(json.loads(args)).replace(":", "=")
            response_text += f"**{sender}:** *{name}({arg_str[1:-1]})*\n"

    return response_text
