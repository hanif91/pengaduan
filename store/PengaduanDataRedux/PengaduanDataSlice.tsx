import { createSlice } from "@reduxjs/toolkit";

interface StateType {
    editDataPengaduan: any;
}

const initialState = {
    editDataPengaduan: null,
};

export const PengaduanDataSlice = createSlice({
    name: "pengaduanData",
    initialState,
    reducers: {
        setEditPengaduanData: (state, action) => {
            state.editDataPengaduan = action.payload;
        },
    }
});

export const { setEditPengaduanData } = PengaduanDataSlice.actions;

export default PengaduanDataSlice.reducer;