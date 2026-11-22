import os

# Pakai SQLite lokal untuk test (sebelum app diimpor & engine dibuat)
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_avatar.db")

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# Tes: daftar preset avatar berisi enam pilihan.
def test_presets_ada_enam():
    r = client.get("/api/avatar/presets")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 6
    assert data[0]["key"] == "klasik"


# Tes: render avatar menghasilkan gambar SVG.
def test_render_svg():
    r = client.get("/api/avatar/render", params={"body": "#4dabff", "hat": "topi"})
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("image/svg+xml")
    assert "#4dabff" in r.text
    assert "<svg" in r.text


# Tes: warna di luar format hex ditolak.
def test_render_menolak_warna_liar():
    r = client.get("/api/avatar/render", params={"body": "bukan-hex"})
    assert r.status_code == 422


# Tes: konfigurasi avatar bisa disimpan lalu diambil kembali.
def test_simpan_dan_ambil_avatar():
    cfg = {"body": "#51cf66", "hat": "none", "accessory": "kacamata"}
    r = client.put("/api/avatar/user-test", json=cfg)
    assert r.status_code == 200
    assert r.json()["config"] == cfg

    r = client.get("/api/avatar/user-test")
    assert r.status_code == 200
    assert r.json()["config"] == cfg


# Tes: user yang belum punya avatar menerima konfigurasi bawaan.
def test_avatar_default_bila_belum_ada():
    r = client.get("/api/avatar/user-baru-xyz")
    assert r.status_code == 200
    assert r.json()["config"]["body"] == "#ff9046"


# Tes: permintaan avatar khusus tersimpan dengan status menunggu.
def test_request_avatar():
    r = client.post(
        "/api/avatar/requests",
        json={"user_id": "user-test", "description": "Avatar pakai hoodie biru"},
    )
    assert r.status_code == 201
    assert r.json()["status"] == "menunggu"

    r = client.get("/api/avatar/requests", params={"user_id": "user-test"})
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) >= 1
    assert data[0]["description"] == "Avatar pakai hoodie biru"
    assert data[0]["user_id"] == "user-test"
