# main.py
from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "안녕하세요! FastAPI와 Cloud Run 예제입니다."}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id, "description": f"아이템 {item_id}에 대한 정보입니다."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)