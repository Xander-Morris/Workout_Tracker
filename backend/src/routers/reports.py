from fastapi import APIRouter, Depends, HTTPException, Request
import database
import models
import auth_helper
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(tags=["reports"], prefix="/reports")
limiter = Limiter(key_func=get_remote_address)

# ALL EXERCISES EVER LOGGED
@router.get("/exercises", response_model=models.AllExercisesReport)
@limiter.limit("20/minute")
async def GetAllExercisesReport(
    request: Request, current_user = Depends(auth_helper.GetCurrentUser)
):
    exercises = database.GetAllExercisesForUser(current_user.user_id)

    return models.AllExercisesReport(
        exercises=exercises
    )

# CONTAINS EXERCISE
@router.post("/contains", response_model=models.WorkoutsThatContainExerciseReport)
@limiter.limit("20/minute")
async def GetReport(
    request: Request,
    payload : models.ExerciseRequest,
    current_user = Depends(auth_helper.GetCurrentUser)
):
    exercise = payload.exercise.strip()

    if not exercise.strip():
        raise HTTPException(
            status_code=400,
            detail="Exercise name cannot be empty"
        )

    workouts = database.GetWorkoutsThatContainExercise(current_user.user_id, exercise)

    if not workouts or len(workouts) <= 0:
        raise HTTPException(status_code=404, detail="Workouts not found")
    
    return models.WorkoutsThatContainExerciseReport(
        exercise=exercise,
        workouts=[models.WorkoutResponse(**w) for w in workouts]
    )   