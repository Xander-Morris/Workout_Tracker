from fastapi import APIRouter, Depends, Request
import lib.database_lib.database as database
import lib.database_lib.models as models
import lib.database_lib.auth_helper as auth_helper
from config import limiter
from lib.misc import dates
from lib.misc.error_handler import APIError, ErrorMessage

router = APIRouter(tags=["reports"], prefix="/reports")

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
        raise APIError.validation_error(ErrorMessage.EMPTY_INPUT)

    workouts = database.GetWorkoutsThatContainExercise(current_user.user_id, exercise)

    if not workouts or len(workouts) <= 0:
        raise APIError.not_found("Workouts")
    
    return models.WorkoutsThatContainExerciseReport(
        exercise=exercise,
        workouts=[models.WorkoutResponse(**w) for w in workouts]
    )   

# VOLUME OVER PERIOD
@router.post("/volume", response_model=models.VolumeOverPeriodReport)
@limiter.limit("10/minute")
async def GetVolumeOverPeriodReport(
    request: Request,
    payload : models.VolumeOverPeriodRequest,
    current_user = Depends(auth_helper.GetCurrentUser)
):  
    # The start date can either be the same as the end date, or before it.
    if payload.start_date > payload.end_date:
        raise APIError.validation_error("The start date must be equal to or before the end date")
    
    exercise = payload.exercise.strip() if payload.exercise else ""
    start_utc, end_utc = dates.LocalDateRangeToUTC(
        payload.start_date,
        payload.end_date,
        payload.timezone,
    )
    total_volume = 0

    # I might default to using the user's bodyweight later as a fallback.
    def AddToTotalVolume(ex):
        nonlocal total_volume
        total_volume += ex["sets"] * ex["reps"] * (ex.get("weight") or 0)

    if exercise:
        workouts = database.GetWorkoutsThatContainExercise(
            current_user.user_id,
            exercise,
            start_utc,
            end_utc,
        )
    else:
        workouts = database.GetAllWorkoutsInPeriod(
            current_user.user_id,
            start_utc,
            end_utc,
        )

    if not workouts:
        return models.VolumeOverPeriodReport(
            total_volume=0,
            exercise=exercise,
        )

    for workout in workouts:
        for ex in workout["exercises"]:
            if not exercise or ex["name"].lower() == exercise.lower():
                AddToTotalVolume(ex)

    return models.VolumeOverPeriodReport(
        total_volume=total_volume,
        exercise=exercise,
    )