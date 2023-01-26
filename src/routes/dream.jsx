import { bDecode, getDream } from "../dream";
import { Form, useLoaderData } from "react-router-dom";

const dateFix = dateString => {
    const dateElems = dateString.split('-');
    return `${dateElems[1]}/${dateElems[2]}/${dateElems[0]}`;
}

export async function loader({params}){
    const dream = await getDream(params.dreamId);
    if (!dream){
        throw new Response("", {
            status: 404,
            statusText: "Not Found"
        });
    }
    return dream;
}

export default function Dream(){
    const dream = useLoaderData();
    return (
        <div id="dream">
            <div>
                <div id="dream-header">
                    <h1>{dream.title}</h1>
                    {dream.date && <p>{dateFix(dream.date)}</p>}
                </div>
                {dream.bodyCode && <p>{bDecode(dream.bodyCode)}</p>}
                <div id="dream-footer">
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form method="post" action="destroy" onSubmit={e => {
                        if(!confirm("Please confirm you want to delete this dream")) e.preventDefault();
                    }}>
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    )
}