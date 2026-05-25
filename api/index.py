import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables (useful for local testing)
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for development

# Initialize OpenAI Client
API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy", 
        "service": "SkillSyniq-Backend-Vercel",
        "api_key_configured": bool(API_KEY and API_KEY != "your_openai_api_key_here")
    }), 200

@app.route('/api/generate', methods=['POST'])
def generate():
    # Fetch key dynamically in case it gets updated in Vercel settings
    current_api_key = os.environ.get("OPENAI_API_KEY")
    if not current_api_key or current_api_key == "your_openai_api_key_here":
        return jsonify({"error": "OpenAI API Key is missing. Please add it to your Vercel Project Environment Variables."}), 500
    
    # Update client key
    client.api_key = current_api_key
    
    try:
        data = request.json
        model = data.get("model", "gpt-4o")
        messages = data.get("messages", [])
        max_tokens = data.get("max_tokens", 700)
        temperature = data.get("temperature", 0.7)

        if not messages:
            return jsonify({"error": "No messages provided"}), 400

        # Create completion call
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )

        # Return the content to the frontend
        return jsonify({
            "choices": [{
                "message": {
                    "content": response.choices[0].message.content
                }
            }]
        }), 200

    except Exception as e:
        print(f"Error in /api/generate: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Fallback to run locally on port 5000
    app.run(debug=True, port=5000)
