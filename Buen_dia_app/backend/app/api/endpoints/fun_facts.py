from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys
import os

from app.services.fun_facts import FunFacts

router = APIRouter()
ff_service = FunFacts()

class FactPayload(BaseModel):
    fact: str

@router.get("/random")
def get_random_fact():
    fact = ff_service.get_random_fact()
    if isinstance(fact, str):
        return {"status": "success", "fact": {"fact": fact}}
    return {"status": "success", "fact": fact}

@router.post("/add")
def add_fact(payload: FactPayload):
    success = ff_service.add_fun_fact(payload.fact)
    if success:
        return {"status": "success", "message": "Fact added"}
    else:
        raise HTTPException(status_code=400, detail="Fact already exists or could not be added")

@router.delete("/remove")
def remove_fact(payload: FactPayload):
    success = ff_service.remove_fun_fact(payload.fact)
    if success:
        return {"status": "success", "message": "Fact removed"}
    else:
        raise HTTPException(status_code=404, detail="Fact not found")
