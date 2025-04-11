from flask import Flask, render_template, request, jsonify
import re
import random
import wikipedia

app = Flask(__name__)
wikipedia.set_lang("en")

patterns = {
    "greeting": r"\b(hi|hello|hey|greetings)\b",
    "goodbye": r"\b(bye|goodbye|exit|quit)\b",
    "thanks": r"\b(thank you|thanks|appreciate)\b",
    "name": r"\b(who are you|your name|what's your name)\b",
    "wiki": r"\b(tell me about|who is|what is|define|explain|information on|describe)\b",
    "default": r"(.*)",
}

responses = {
    "greeting": ["Hello!", "Hi there!", "Greetings!"],
    "goodbye": ["Goodbye!", "See you later!", "Take care!"],
    "thanks": ["You're welcome!", "No problem!", "Anytime!"],
    "name": ["I'm EduBot, your voice-based learning assistant."],
    "default": [
        "I'm not sure I understand. Can you try rephrasing?",
        "Hmm, that's beyond my current training.",
        "Let's try a different question!"
    ]
}

def classify(text):
    for intent, pattern in patterns.items():
        if re.search(pattern, text, re.IGNORECASE):
            return intent
    return "default"

def get_wiki_summary(query):
    try:
        topic = re.sub(r"(tell me about|who is|what is|define|explain|information on|describe)", "", query, flags=re.IGNORECASE).strip()
        summary = wikipedia.summary(topic, sentences=2)
        return summary
    except wikipedia.exceptions.DisambiguationError as e:
        return f"Multiple results. Try being more specific: {', '.join(e.options[:3])}"
    except wikipedia.exceptions.PageError:
        return "Sorry, I couldn't find any information on that."
    except Exception as e:
        return f"An error occurred: {str(e)}"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    if not user_input:
        return jsonify({"response": "I didn't get that."})

    intent = classify(user_input.lower())
    if intent == "wiki":
        response = get_wiki_summary(user_input)
    else:
        response = random.choice(responses.get(intent, responses["default"]))

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)