from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_ok():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_health_ok():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_chat_stub_mode():
    # Tanpa LLM_API_KEY, endpoint harus balas dalam mode stub
    r = client.post("/api/chat", json={"message": "halo"})
    assert r.status_code == 200
    body = r.json()
    assert body["mode"] == "stub"
    assert "halo" in body["reply"]


def test_chat_rejects_empty_message():
    r = client.post("/api/chat", json={"message": ""})
    assert r.status_code == 422
