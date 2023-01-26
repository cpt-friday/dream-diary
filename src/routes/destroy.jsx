import { redirect } from "react-router-dom";
import { deleteDream } from "../dream";

export async function action({params}){
    throw new Error("Oopsies!");
    await deleteDream(params.dreamId);
    return redirect('/');
}