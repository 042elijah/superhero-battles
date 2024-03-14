import React,{useState} from "react";
import PastBattleDetailView from './PastBattleDetailView';
import axios from "axios";

const URL = `http://localhost:4000`;

function PastBattleContainer(props:any) {
    const [record, setRecord] = useState({} as any);

    let data =  getRecordByUsername(props.username);
    setRecord(data);

    async function getRecordByUsername(username:any) {
        try {
            let response = await axios.get(`${URL}/battleground/record/${username}`);
            
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <PastBattleDetailView record = {record} />
        </>
    )
}

export default PastBattleContainer