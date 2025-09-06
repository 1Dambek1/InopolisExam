from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn as nn
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

model = nn.Sequential(
    nn.Linear(22,64, bias=False),
    nn.BatchNorm1d(64),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(64,32, bias=False),
    nn.BatchNorm1d(32),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(32,2, bias=True))

input_features = [
    "PTS", "REB", "AST", "STL", "BLK", "TOV",
    "FGM", "FGA", "FG_PCT",
    "FG3M", "FG3A", "FG3_PCT",
    "FTM", "FTA", "FT_PCT",
    "OREB", "DREB", "PF", "PFD", "PLUS_MINUS",
    "ELO", "REST_DAYS"
]

model.load_state_dict(torch.load("model_params.tar"))
model.eval()


app = FastAPI(title="NBA Match Prediction API")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class MatchData(BaseModel):
    PTS: float
    REB: float
    AST: float
    STL: float
    BLK: float
    TOV: float
    FGM: float
    FGA: float
    FG_PCT: float
    FG3M: float
    FG3A: float
    FG3_PCT: float
    FTM: float
    FTA: float
    FT_PCT: float
    OREB: float
    DREB: float
    PF: float
    PFD: float
    PLUS_MINUS: float
    ELO: float
    REST_DAYS: float

@app.post("/predict")
def predict(match: MatchData):
    x = np.array([[getattr(match, f) for f in input_features]], dtype=np.float32)
    x_tensor = torch.tensor(x)
    with torch.no_grad():
        pred = model(x_tensor)
        prob = torch.softmax(pred, dim=1).numpy()[0]
        pred_class = int(prob.argmax())
    return {
        "prediction": pred_class,
        "prob_home_loss": round(float(prob[0]),3),
        "prob_home_win": round(float(prob[1]),3)
    }
