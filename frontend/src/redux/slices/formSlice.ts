import {createSlice} from '@reduxjs/toolkit';

// Form slice: Manages local form state (input values)
// Stores in state for UX

// Initial state is an empty object
const initialState = {
    data: {}
};

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        updateField: (state: any, action) => {
            const {name, value} = action.payload;
            state.data[name] = value;
        }
    }
});

export const { updateField } = formSlice.actions;
export default formSlice.reducer;