from fastapi.testclient import TestClient

from app.core.config import settings
from app.db import memory as store
from app.main import app

client = TestClient(app)


def setup_function():
    # tiap test mulai dari penyimpanan kosong + auth mati (mode dev)
    store.reset_store()
    settings.api_key = ""


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


def test_chat_returns_session_and_saves_history():
    r = client.post("/api/chat", json={"message": "halo"})
    assert r.status_code == 200
    session_id = r.json()["session_id"]
    assert session_id

    # riwayat berisi 2 pesan: user + balasan asisten
    r2 = client.get(f"/api/chat/history/{session_id}")
    assert r2.status_code == 200
    msgs = r2.json()["messages"]
    assert [m["role"] for m in msgs] == ["user", "assistant"]
    assert msgs[0]["content"] == "halo"


def test_chat_continues_same_session():
    r1 = client.post("/api/chat", json={"message": "pesan pertama"})
    session_id = r1.json()["session_id"]

    r2 = client.post(
        "/api/chat", json={"message": "pesan kedua", "session_id": session_id}
    )
    assert r2.json()["session_id"] == session_id

    r3 = client.get(f"/api/chat/history/{session_id}")
    assert len(r3.json()["messages"]) == 4  # 2x user + 2x asisten


def test_delete_history():
    r1 = client.post("/api/chat", json={"message": "halo"})
    session_id = r1.json()["session_id"]

    r2 = client.delete(f"/api/chat/history/{session_id}")
    assert r2.json() == {"session_id": session_id, "deleted": True}

    r3 = client.get(f"/api/chat/history/{session_id}")
    assert r3.json()["messages"] == []


def test_auth_rejects_wrong_key():
    settings.api_key = "rahasia123"
    r = client.post("/api/chat", json={"message": "halo"})
    assert r.status_code == 401
    r2 = client.post(
        "/api/chat", json={"message": "halo"}, headers={"X-API-Key": "salah"}
    )
    assert r2.status_code == 401


def test_auth_accepts_correct_key():
    settings.api_key = "rahasia123"
    r = client.post(
        "/api/chat", json={"message": "halo"}, headers={"X-API-Key": "rahasia123"}
    )
    assert r.status_code == 200
    r2 = client.get(
        f"/api/chat/history/{r.json()['session_id']}",
        headers={"X-API-Key": "rahasia123"},
    )
    assert r2.status_code == 200
