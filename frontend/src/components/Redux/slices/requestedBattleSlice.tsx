import { createSlice } from "@reduxjs/toolkit";


export const requestedBattleSlice = createSlice({
    name: "requestedBattle",
    initialState: { 
        challenger: '',
        challengerTeam: '',
        opponent: '',
        opponentTeam: ''
    },
    reducers: {
        setRequestedBattle(state, battleParams) {
            const { challenger, challengerTeam, opponent, opponentTeam } = battleParams.payload;

            state.challenger = challenger;
            state.challengerTeam = challengerTeam;
            state.opponent = opponent;
            state.opponentTeam = opponentTeam;
        }
    }
})

export const requestedBattleActions = requestedBattleSlice.actions;
export default requestedBattleSlice.reducer; // The Redux tutorial on React's website had two exports (not sure why though)