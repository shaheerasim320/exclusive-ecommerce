import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    timers : []
}

const timerSlice = createSlice({
    name:'timer',
    initialState ,
    reducers:{
        startTimer: (state, action) =>{
            const {id, time}= action.payload
            const newTimer = {
                id, 
                time,
                isRunning : true
            }
            state.timers.push(newTimer)
        },
        stopTimer:(state,action)=>{
            const {id} = action.payload
            const timer = state.timers.find((timer)=> timer.id == id)
            if(timer){
                timer.isRunning = false
            }
        },
        resetTimer:(state,action)=>{
            const {id} = action.payload
            const timer = state.timers.find((timer)=> timer.id ==id)
            if(timer){
                timer.time = 0
                timer.isRunning= false
            }
        },
        updateTimer:(state)=>{
            state.timers.forEach((timer)=>{
                if(timer.isRunning && timer.time > 0){
                    timer.time-=1
                }
                if(timer.isRunning && timer.time==0){
                    timer.isRunning=false
                }
            })
        }
    }
})

export const {startTimer, stopTimer, resetTimer, updateTimer} = timerSlice.actions

export default timerSlice.reducer