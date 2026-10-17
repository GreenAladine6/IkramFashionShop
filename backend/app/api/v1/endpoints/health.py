from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health check endpoint")
def health_check() -> dict[str, str]:
    """
    Health check endpoint to verify the service is running.

    Returns:
        dict: A dictionary containing the status of the service.
    """
    return {"status": "ok", "application": "Ikram fashion shop api",}