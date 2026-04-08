from io import BytesIO
from pathlib import Path

from fastapi import HTTPException, UploadFile


SUPPORTED_EXTENSIONS = {".txt", ".pdf", ".docx"}


def extract_text_from_upload(upload_file: UploadFile) -> str:
    extension = Path(upload_file.filename or "").suffix.lower()
    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use TXT, PDF, or DOCX.")

    data = upload_file.file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if extension == ".txt":
        return data.decode("utf-8", errors="ignore")

    if extension == ".pdf":
        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise HTTPException(status_code=500, detail="PDF support is not installed.") from exc

        reader = PdfReader(BytesIO(data))
        return "\n".join((page.extract_text() or "") for page in reader.pages).strip()

    if extension == ".docx":
        try:
            from docx import Document
        except ImportError as exc:
            raise HTTPException(status_code=500, detail="DOCX support is not installed.") from exc

        document = Document(BytesIO(data))
        return "\n".join(paragraph.text for paragraph in document.paragraphs).strip()

    raise HTTPException(status_code=400, detail="Unable to parse file.")
