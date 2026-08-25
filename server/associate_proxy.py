"""
NEX ASSOCIATE — Backend Proxy

Why this exists: NEX Associate's api_client.js held a hardcoded internal API
key ("nexus-internal-dev-token") and called nex-curriculum's internal-only
API directly from the browser — the same exposure class found and fixed in
NEX Quizzer earlier this session (see quizzer_proxy.py's docstring). That
key was committed to the public NEX-Associate GitHub repo and visible to
anyone via browser dev tools on the live page.

This proxy is the fix: it holds the real nex-curriculum credentials
server-side in its own .env (never shipped to the browser) and exposes the
2 operations NEX Associate's frontend needs. api_client.js now talks to
this proxy instead of nex-curriculum directly.

Run:
  pip install flask requests python-dotenv
  # create .env next to this file (see .env.example) with
  # NEX_INTERNAL_API_KEY (must match nex-curriculum's INTERNAL_API_KEY)
  python associate_proxy.py
  -> http://127.0.0.1:5002
"""

import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import requests

load_dotenv()

app = Flask(__name__)

NEX_CURRICULUM_API_URL = os.environ.get("NEX_CURRICULUM_API_URL", "http://localhost:3000").rstrip("/")
NEX_INTERNAL_API_KEY = os.environ.get("NEX_INTERNAL_API_KEY")
NEX_INTERNAL_SERVICE_TOKEN = os.environ.get("NEX_INTERNAL_SERVICE_TOKEN")
DEFAULT_TIMEOUT = 25


@app.after_request
def _add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/api/v1/associate/<path:_subpath>", methods=["OPTIONS"])
def _cors_preflight(_subpath):
    return "", 200


def _curriculum_headers():
    headers = {"Content-Type": "application/json"}
    if NEX_INTERNAL_API_KEY:
        headers["x-internal-api-key"] = NEX_INTERNAL_API_KEY
    if NEX_INTERNAL_SERVICE_TOKEN:
        headers["x-internal-token"] = NEX_INTERNAL_SERVICE_TOKEN
    return headers


def _curriculum_request(method, path, **kwargs):
    if not NEX_INTERNAL_API_KEY:
        raise RuntimeError(
            "NEX_INTERNAL_API_KEY is not set on the proxy. Add it to .env next to "
            "associate_proxy.py — it must match nex-curriculum's own INTERNAL_API_KEY."
        )
    url = f"{NEX_CURRICULUM_API_URL}{path}"
    resp = requests.request(method, url, headers=_curriculum_headers(), timeout=DEFAULT_TIMEOUT, **kwargs)
    resp.raise_for_status()
    return resp.json()


@app.route("/api/v1/associate/kit", methods=["GET"])
def get_teacher_kit():
    """
    GET /api/v1/associate/kit?subject=&grade=&topic=
    Resolves the best-matching topic, ensures content exists, and delivers
    the real teacher package (target=associate). Mirrors the resolution
    logic that used to live client-side in api_client.js's
    queryNexCurriculum() — moved server-side so the credential never has to
    reach the browser.
    """
    subject = request.args.get("subject", "MATHEMATICS")
    grade = request.args.get("grade", "SS2")
    topic_search = request.args.get("topic", "")

    try:
        topics_data = _curriculum_request("GET", "/curriculum/topics", params={"subject": subject, "grade": grade})
        topics = topics_data.get("topics", [])
        if not topics:
            return jsonify({"source": "NO_TOPIC_FOUND", "topic": None, "materials": None})

        matched = topics[0]
        if topic_search:
            for t in topics:
                if topic_search.lower() in t.get("title", "").lower():
                    matched = t
                    break

        topic_id = matched["id"]
        try:
            _curriculum_request("POST", "/curriculum/content", json={"topicId": topic_id})
        except requests.exceptions.RequestException:
            pass  # content may already exist, or generation failed — /deliver below still returns whatever exists

        delivery = _curriculum_request("POST", "/curriculum/deliver", json={"topicId": topic_id, "target": "associate"})
        return jsonify({"source": "LIVE_NEX_CURRICULUM", "topic": matched, "materials": delivery.get("materials")})
    except requests.exceptions.RequestException as e:
        return jsonify({"source": "BACKEND_UNREACHABLE", "topic": None, "materials": None, "error": str(e)}), 502
    except RuntimeError as e:
        return jsonify({"source": "PROXY_MISCONFIGURED", "topic": None, "materials": None, "error": str(e)}), 500


@app.route("/api/v1/associate/feedback", methods=["POST"])
def forward_feedback():
    """
    POST /api/v1/associate/feedback
    Body: {subject, class, comment}. Opens a real NEX Care ticket and posts
    the teacher's comment as a message, returning NEX Care's real response.
    """
    data = request.json or {}
    try:
        ticket_res = _curriculum_request("POST", "/care/tickets", json={"userId": "teacher_portal_associate"})
        ticket_id = (ticket_res.get("ticket") or {}).get("id")
        if not ticket_id:
            raise RuntimeError("NEX Care did not return a ticket id")

        content = f"[NEX Associate Feedback - {data.get('subject', 'Unknown Subject')} ({data.get('class', 'Unknown Class')})]: {data.get('comment', '')}"
        message_res = _curriculum_request("POST", f"/care/tickets/{ticket_id}/messages", json={"content": content})

        return jsonify({"success": True, "ticket_id": ticket_id, "response": message_res.get("response")})
    except (requests.exceptions.RequestException, RuntimeError) as e:
        return jsonify({"success": False, "error": str(e)}), 502


if __name__ == "__main__":
    print("NEX Associate proxy running on http://127.0.0.1:5002")
    if not NEX_INTERNAL_API_KEY:
        print("WARNING: NEX_INTERNAL_API_KEY is not set — every call to nex-curriculum will fail.")
    app.run(port=5002, debug=True)
