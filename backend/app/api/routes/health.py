from fastapi import APIRouter

router = APIRouter()


# Cek kesehatan: penanda backend hidup dan siap menerima request.
@router.get("/health")
def health():
    return {"status": "ok"}
